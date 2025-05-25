// src/redux/middleware/socketMiddleware.js
import { io } from "socket.io-client";
import { appendOutput, setSocketId } from "../slices/compilerSlice";
import { setTemplateHtml } from "../slices/editorSlice";
import { 
  setHtmlEnhancementProgress, 
  setHtmlEnhancementError,
  setHtmlEnhancementComplete 
} from "../slices/resumeSlice";
import { publishedPortfolioUrl } from "@/api";

// Socket.io middleware for Redux
const socketMiddleware = () => {
  let socket = null;

  return store => next => action => {
    // Initialize socket connection if not already established
    if (!socket) {
      socket = io(publishedPortfolioUrl);
      
      // Set socket ID when connected
      socket.on("connect", () => {
        store.dispatch(setSocketId(socket.id));
        console.log("Socket connected with ID:", socket.id);
      });
      
      // Handle delayed outputs from async code execution
      socket.on("delayed-output", (data) => {
        store.dispatch(appendOutput(data.output));
      });

      // HTML Enhancement Progress Events
      socket.on("html-enhancement-progress", (data) => {
        store.dispatch(setHtmlEnhancementProgress({
          status: data.status,
          message: data.message,
          progress: data.progress,
          currentSection: data.currentSection || null,
          totalSections: data.totalSections || null
        }));

        // Update template HTML progressively if available
        if (data.cumulativeHtml) {
          store.dispatch(setTemplateHtml(data.cumulativeHtml));
        }
      });

      // Section Complete Events - Progressive HTML Update
      socket.on("html-enhancement-section-complete", (data) => {
        console.log(`Section ${data.sectionIndex}/${data.totalSections} completed`);
        
        // Update progress
        store.dispatch(setHtmlEnhancementProgress({
          status: data.status,
          message: data.message,
          progress: data.progress,
          currentSection: data.sectionIndex,
          totalSections: data.totalSections
        }));

        // Update template HTML with cumulative content
        if (data.cumulativeHtml) {
          store.dispatch(setTemplateHtml(data.cumulativeHtml));
        }
      });

      // Sub-section progress for large sections
      socket.on("html-enhancement-subsection-progress", (data) => {
        console.log(`Sub-section ${data.subSectionIndex}/${data.totalSubSections} completed for section ${data.sectionNumber}`);
        
        // Update template HTML with cumulative content including sub-sections
        if (data.cumulativeHtml) {
          store.dispatch(setTemplateHtml(data.cumulativeHtml));
        }
      });

      // Warning events
      socket.on("html-enhancement-warning", (data) => {
        console.warn("HTML Enhancement Warning:", data.message);
        // You can dispatch a warning action if needed
      });

      // Error events
      socket.on("html-enhancement-error", (data) => {
        console.error("HTML Enhancement Error:", data.message);
        store.dispatch(setHtmlEnhancementError(data.message));
      });

      // Final completion
      socket.on("html-enhancement-complete", (data) => {
        console.log("HTML Enhancement completed successfully");
        store.dispatch(setHtmlEnhancementComplete());
        
        // Ensure final HTML is set
        if (data.finalHtml) {
          store.dispatch(setTemplateHtml(data.finalHtml));
        }
      });
      
      // Reconnect logic
      socket.on("disconnect", () => {
        console.log("Socket disconnected");
      });
      
      socket.on("reconnect", () => {
        console.log("Socket reconnected with ID:", socket.id);
        store.dispatch(setSocketId(socket.id));
      });
    }
    
    // Special actions for socket management
    if (action.type === 'socket/connect' && !socket.connected) {
      socket.connect();
    }
    
    if (action.type === 'socket/disconnect') {
      if (socket.connected) {
        socket.disconnect();
      }
    }
    
    return next(action);
  };
};

export default socketMiddleware;