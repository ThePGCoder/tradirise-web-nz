// src/lib/data/navItemData.ts
import { NavProps } from "@/types/navItem";

// Public navigation (no auth required)
export const publicNavData: NavProps[] = [
  {
    title: "Home",
    icon: "ri:home-fill",
    link: "/home",
  },
  /*{
    title: "Blog Articles",
    icon: "tabler:article-filled",
    link: "/notifications",
  },*/
  {
    title: "Browse",
    icon: "fluent:text-bullet-list-square-search-20-filled",
    dropdown: true,
    subMenu: [
      {
        title: "Personnel",
        icon: "entypo:v-card",
        link: "/listings/personnel",
      },
      {
        title: "Positions",
        icon: "fluent:person-star-16-filled",
        link: "/listings/positions",
      },
      {
        title: "Projects",
        icon: "mingcute:house-fill",
        link: "/listings/projects",
      },
      {
        title: "Businesses",
        icon: "ic:baseline-business",
        link: "/listings/businesses",
      },
      {
        title: "Marketplace",
        icon: "mdi:cart",
        link: "/listings/marketplace",
      },
    ],
  },
  {
    title: "Profiles",
    icon: "mdi:account-circle",
    link: "/profiles",
  },
  {
    title: "Login",
    icon: "ri:login-box-fill",
    link: "/login",
  },
];

// Protected navigation (requires auth)
export const protectedNavData: NavProps[] = [
  {
    title: "Home",
    icon: "ri:home-fill",
    link: "/home",
  },
  /*{
    title: "Blog Articles",
    icon: "tabler:article-filled",
    link: "/blog-articles",
  },*/
  {
    title: "Notifications",
    icon: "mdi:notifications",
    link: "/notifications",
  },
  {
    title: "Browse Listings",
    icon: "fluent:text-bullet-list-square-search-20-filled",
    dropdown: true,
    subMenu: [
      {
        title: "Personnel",
        icon: "entypo:v-card",
        link: "/listings/personnel",
      },
      {
        title: "Positions",
        icon: "fluent:person-star-16-filled",
        link: "/listings/positions",
      },
      {
        title: "Projects",
        icon: "mingcute:house-fill",
        link: "/listings/projects",
      },
      {
        title: "Businesses",
        icon: "ic:baseline-business",
        link: "/listings/businesses",
      },
      {
        title: "Marketplace",
        icon: "mdi:cart",
        link: "/listings/marketplace",
      },
    ],
  },
  {
    title: "My Listings",
    icon: "fluent:text-bullet-list-square-person-20-filled",
    link: "/my-listings",
  },
  {
    title: "My Favourites",
    icon: "mdi:star",
    link: "/my-favourites",
  },
  {
    title: "Profiles",
    icon: "mdi:account-circle",
    dropdown: true,
    subMenu: [
      {
        title: "My Profile",
        icon: "mdi:account-box",
        link: "/profiles/profile",
      },
      {
        title: "My Businesses",
        icon: "ic:baseline-business",
        link: "/profiles/business-profiles",
      },
    ],
  },
  {
    title: "Account",
    icon: "mage:dollar-fill",
    link: "/account",
  },
  {
    title: "Settings",
    icon: "mdi:settings",
    link: "/settings",
  },
  {
    title: "Logout",
    icon: "ri:logout-box-fill",
    link: "/logout",
  },
];

// Backwards compatibility - default to protected
export const navItemData = protectedNavData;
