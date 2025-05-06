import { useContext } from "react";
import { CompilerContext } from "../context";

// Custom hook to use the context
export const useCompiler = () => {
    const context = useContext(CompilerContext);
    if (context === undefined) {
      throw new Error('useCompiler must be used within a CompilerProvider');
    }
    return context;
  };