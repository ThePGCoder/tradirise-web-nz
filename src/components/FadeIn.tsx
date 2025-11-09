import { motion } from "framer-motion"

import React, { ReactNode } from 'react';

interface FadeInProps {
    children: ReactNode;
}

const FadeIn: React.FC<FadeInProps> = ({children}) => {
    return (
        <motion.div
        initial={{ opacity: 0, scale: 1 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4 }}
      >
        {children}
      </motion.div>
    );
};

export default FadeIn;

