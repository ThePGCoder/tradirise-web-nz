"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import {
  BusinessEndorsementData,
  CategoryEndorsementData,
  RecommendationData,
  ENDORSEMENT_CATEGORIES,
  CreateRecommendationRequest,
  RELATIONSHIP_TYPES,
  EndorsementCategory,
  RelationshipType,
} from "../types/endorsements";

export async function getBusinessEndorsements(
  businessId: string
): Promise<BusinessEndorsementData> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get total endorsements
  const { count: totalEndorsements } = await supabase
    .from("endorsements")
    .select("*", { count: "exact", head: true })
    .eq("business_id", businessId);

  // Get total recommendations
  const { count: totalRecommendations } = await supabase
    .from("recommendations")
    .select("*", { count: "exact", head: true })
    .eq("business_id", businessId);

  // Get total views (unique by IP in last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { count: totalViews } = await supabase
    .from("profile_views")
    .select("ip_address", { count: "exact", head: true })
    .eq("business_id", businessId)
    .gte("created_at", thirtyDaysAgo.toISOString());

  // Check if user has endorsed/recommended
  let hasUserEndorsed = false;
  let hasUserRecommended = false;

  if (user) {
    const { data: endorsement } = await supabase
      .from("endorsements")
      .select("id")
      .eq("business_id", businessId)
      .eq("user_id", user.id)
      .single();
    hasUserEndorsed = !!endorsement;

    const { data: recommendation } = await supabase
      .from("recommendations")
      .select("id")
      .eq("business_id", businessId)
      .eq("user_id", user.id)
      .single();
    hasUserRecommended = !!recommendation;
  }

  // Get category endorsements with counts
  const { data: categoryData } = await supabase
    .from("category_endorsements")
    .select("category")
    .eq("business_id", businessId);

  const categoryCounts = (categoryData || []).reduce(
    (acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const categoryEndorsements: CategoryEndorsementData[] = await Promise.all(
    Object.entries(categoryCounts).map(async ([category, count]) => {
      let hasUserEndorsed = false;

      if (user) {
        const { data } = await supabase
          .from("category_endorsements")
          .select("id")
          .eq("business_id", businessId)
          .eq("user_id", user.id)
          .eq("category", category)
          .single();
        hasUserEndorsed = !!data;
      }

      return { category, count, hasUserEndorsed };
    })
  );

  // Get recent recommendations
  const { data: recommendationsData } = await supabase
    .from("recommendations")
    .select("id, recommender_name, relationship_type, tags, created_at")
    .eq("business_id", businessId)
    .order("created_at", { ascending: false })
    .limit(10);

  const recommendations: RecommendationData[] = (recommendationsData || []).map(
    (rec) => ({
      id: rec.id,
      recommenderName: rec.recommender_name,
      relationshipType: rec.relationship_type,
      tags: rec.tags || [],
      createdAt: rec.created_at,
    })
  );

  // Get relationship breakdown
  const relationshipBreakdown = (recommendationsData || []).reduce(
    (acc, rec) => {
      acc[rec.relationship_type] = (acc[rec.relationship_type] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return {
    totalEndorsements: totalEndorsements || 0,
    totalRecommendations: totalRecommendations || 0,
    totalViews: totalViews || 0,
    hasUserEndorsed,
    hasUserRecommended,
    categoryEndorsements: categoryEndorsements.sort(
      (a, b) => b.count - a.count
    ),
    recommendations,
    relationshipBreakdown,
  };
}

export async function toggleEndorsement(businessId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Must be logged in to endorse" };
  }

  const { data: existing } = await supabase
    .from("endorsements")
    .select("id")
    .eq("business_id", businessId)
    .eq("user_id", user.id)
    .single();

  const isNewEndorsement = !existing;

  if (existing) {
    const { error } = await supabase
      .from("endorsements")
      .delete()
      .eq("id", existing.id);

    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from("endorsements").insert({
      business_id: businessId,
      user_id: user.id,
    });

    if (error) return { error: error.message };
  }

  // Create notification for new endorsements only
  if (isNewEndorsement) {
    try {
      // Get user's profile for name
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, first_name, last_name")
        .eq("id", user.id)
        .single();

      const endorserName =
        profile?.full_name ||
        (profile?.first_name && profile?.last_name
          ? `${profile.first_name} ${profile.last_name}`
          : null) ||
        user.email?.split("@")[0] ||
        "Someone";

      // Get business owner ID and name
      const { data: business } = await supabase
        .from("businesses")
        .select("auth_id, business_name")
        .eq("id", businessId)
        .single();

      console.log("Endorsement notification check:", {
        businessOwnerId: business?.auth_id,
        currentUserId: user.id,
        businessName: business?.business_name,
        endorserName,
        willNotify: business?.auth_id && business.auth_id !== user.id,
      });

      if (business?.auth_id && business.auth_id !== user.id) {
        // Don't notify if user endorses their own business
        // Use same insert pattern as recommendation (which works)
        await supabase.from("notifications").insert({
          user_id: business.auth_id,
          type: "business_inquiry",
          title: "New Endorsement",
          message: `${endorserName} endorsed your business ${business.business_name}`,
          link: `/businesses/${businessId}`,
          read: false,
        });
        console.log("✅ Endorsement notification created");
      } else {
        console.log("Skipping notification - user endorsed their own business");
      }
    } catch (notificationError) {
      console.error(
        "Error creating endorsement notification:",
        notificationError
      );
      // Don't fail the request if notification fails
    }
  }

  revalidatePath(`/businesses/${businessId}`);
  return { success: true };
}

export async function toggleCategoryEndorsement(
  businessId: string,
  category: string
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Must be logged in to endorse categories" };
  }

  // Type-safe check
  if (!ENDORSEMENT_CATEGORIES.includes(category as EndorsementCategory)) {
    return { error: "Invalid category" };
  }

  const { data: existing } = await supabase
    .from("category_endorsements")
    .select("id")
    .eq("business_id", businessId)
    .eq("user_id", user.id)
    .eq("category", category)
    .single();

  const isNewEndorsement = !existing;

  if (existing) {
    const { error } = await supabase
      .from("category_endorsements")
      .delete()
      .eq("id", existing.id);

    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from("category_endorsements").insert({
      business_id: businessId,
      user_id: user.id,
      category,
    });

    if (error) return { error: error.message };
  }

  // Create notification for new category endorsements only
  if (isNewEndorsement) {
    try {
      // Get user's profile for name
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, first_name, last_name")
        .eq("id", user.id)
        .single();

      const endorserName =
        profile?.full_name ||
        (profile?.first_name && profile?.last_name
          ? `${profile.first_name} ${profile.last_name}`
          : null) ||
        user.email?.split("@")[0] ||
        "Someone";

      // Get business owner ID and name
      const { data: business } = await supabase
        .from("businesses")
        .select("auth_id, business_name")
        .eq("id", businessId)
        .single();

      if (business?.auth_id && business.auth_id !== user.id) {
        // Don't notify if user endorses their own business
        await supabase.from("notifications").insert({
          user_id: business.auth_id,
          type: "business_inquiry",
          title: "New Category Endorsement",
          message: `${endorserName} endorsed ${category} for ${business.business_name}`,
          link: `/businesses/${businessId}`,
          read: false,
        });
        console.log("✅ Category endorsement notification created");
      }
    } catch (notificationError) {
      console.error(
        "Error creating category endorsement notification:",
        notificationError
      );
      // Don't fail the request if notification fails
    }
  }

  revalidatePath(`/businesses/${businessId}`);
  return { success: true };
}

export async function createRecommendation(
  businessId: string,
  data: CreateRecommendationRequest
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Must be logged in to recommend" };
  }

  // Type-safe check
  if (!RELATIONSHIP_TYPES.includes(data.relationshipType as RelationshipType)) {
    return { error: "Invalid relationship type" };
  }

  if (data.tags.length > 3) {
    return { error: "Maximum 3 tags allowed" };
  }

  // Type-safe check for tags
  for (const tag of data.tags) {
    if (!ENDORSEMENT_CATEGORIES.includes(tag as EndorsementCategory)) {
      return { error: "Invalid tag" };
    }
  }

  // Get user's profile for name
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, first_name, last_name")
    .eq("id", user.id)
    .single();

  const recommenderName =
    profile?.full_name ||
    (profile?.first_name && profile?.last_name
      ? `${profile.first_name} ${profile.last_name}`
      : null) ||
    user.email?.split("@")[0] ||
    "Anonymous User";

  const { data: existing } = await supabase
    .from("recommendations")
    .select("id")
    .eq("business_id", businessId)
    .eq("user_id", user.id)
    .single();

  const isNewRecommendation = !existing;

  if (existing) {
    const { error } = await supabase
      .from("recommendations")
      .update({
        relationship_type: data.relationshipType,
        tags: data.tags,
      })
      .eq("id", existing.id);

    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from("recommendations").insert({
      business_id: businessId,
      user_id: user.id,
      recommender_name: recommenderName,
      relationship_type: data.relationshipType,
      tags: data.tags,
    });

    if (error) return { error: error.message };
  }

  // Create notification for new recommendations only
  if (isNewRecommendation) {
    try {
      // Get business owner ID and name
      const { data: business } = await supabase
        .from("businesses")
        .select("auth_id, business_name")
        .eq("id", businessId)
        .single();

      if (business?.auth_id && business.auth_id !== user.id) {
        // Don't notify if user recommends their own business
        await supabase.from("notifications").insert({
          user_id: business.auth_id,
          type: "business_inquiry",
          title: "New Recommendation",
          message: `${recommenderName} recommended your business ${business.business_name}`,
          link: `/businesses/${businessId}`,
          read: false,
        });
        console.log("✅ Recommendation notification created");
      }
    } catch (notificationError) {
      console.error(
        "Error creating recommendation notification:",
        notificationError
      );
      // Don't fail the request if notification fails
    }
  }

  revalidatePath(`/businesses/${businessId}`);
  return { success: true };
}

export async function trackProfileView(businessId: string, ipAddress?: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("profile_views").insert({
    business_id: businessId,
    user_id: user?.id || null,
    ip_address: ipAddress || null,
  });

  if (error) {
    console.error("Failed to track profile view:", error);
  }
}
