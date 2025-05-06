// src/redux/slices/compilerSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { DEFAULT_CODE, getDefaultCodeForLanguage, getFileExtension, sanitizeErrorTrace } from "../../Utils";
import { extractCodeBlocks, generateDeviceId, getBaseUrl } from "../../Utils";
import { encryptRequest, decryptResponse } from '../../cryptoUtils';
import apis from "../../api";
import { codeExecuteService } from '../../common/service';
import prompts from '../../constants/prompt.json';
import runtimesJson from '../../constants/runtimes.json';
// Define initial state
const initialState = {
  // Editor state
  runtimes:runtimesJson,
  selectedLanguage: 'javascript', // dynamic dropdown
  code: DEFAULT_CODE,
  output: "",
  isLoading: false,
  
  // Question/Answer state
  question: "",
  isQuestionInputVisible: false,
  answer: "",
  codeAnswer: "",
  showAnswer: false,
  cursorPosition: null,
  answerPosition: { top: 0, left: 0 },
  
  // UI state
  activeTab: "editor", // For mobile view tabs
  isMobileView: false,
  showFeedback: false,
  
  // Socket state
  socketId: null,
  editorInstance: null,
  // Device information
  deviceInfo: {
    timestamp: new Date().toISOString(),
    userAgent: "",
    screenWidth: 0,
    screenHeight: 0,
    ip: "",
    language: "",
    deviceId: ""
  }
};
let editorInstance = null;

export const setEditorInstance = (editor) => {
  editorInstance = editor;
};

export const fetchRuntimes = createAsyncThunk(
    'compiler/fetchRuntimes',
    async (_, { rejectWithValue }) => {
      try {
        const response = await fetch("https://emkc.org/api/v2/piston/runtimes");
        const data = await response.json();
        return data; // This will go into state.compiler.runtimes
      } catch (error) {
        return rejectWithValue("Failed to fetch runtimes: " + error.message);
      }
    }
  );

export const runCode = createAsyncThunk(
    'compiler/runCode',
    async (_, { getState, rejectWithValue }) => {
      try {
        const { code, selectedLanguage, runtimes, deviceInfo } = getState().compiler;
  
        if (!code.trim()) {
          return rejectWithValue("Code cannot be empty");
        }
  
        const language = selectedLanguage || "javascript";
  
        // Find runtime for selected language
        const matchedRuntime = runtimes.find(
          (rt) => rt.language === language || rt.aliases.includes(language)
        );
        if (!matchedRuntime) {
          return rejectWithValue(`Unsupported or unknown language: ${language}`);
        }
  
        const payload = {
          deviceInfo: {
          ...deviceInfo,
          timestamp: new Date().toISOString()
          },
          language: matchedRuntime.language,
          version: matchedRuntime.version,
          files: [
            {
              name: `main.${getFileExtension(matchedRuntime.language)}`,
              content: code
            }
          ]
        };
        const encryptedPayload = encryptRequest(payload);
        const response = await fetch(apis.codeExecute, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(encryptedPayload)
        });
  
        const data = await response.json();
        const decrypted = decryptResponse(data);
        if(decrypted.success){
          return sanitizeErrorTrace(
              decrypted?.result.run?.stdout || decrypted?.result.run?.stderr || decrypted?.result.run?.code || "No output"
            );
        }else{
          return decrypted?.output
        }
      } catch (error) {
        return rejectWithValue("Error running code: " + decryptResponse(error.message));
      }
    }
  );
  
// Async thunk for asking questions
export const askQuestion = createAsyncThunk(
  'compiler/askQuestion',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { question, deviceInfo, selectedLanguage } = getState().compiler;
      
      if (!question.trim()) {
        return rejectWithValue("Question cannot be empty");
      }
    const languageKey = selectedLanguage.toLowerCase();
    const suffix = prompts[languageKey]?.prompt_suffix || "Return only the output.";
      // Encrypt the request body with device info
      const encryptedPayload = encryptRequest({ 
          question: question + ` ${suffix}`,
            deviceInfo: {
            ...deviceInfo,
            timestamp: new Date().toISOString()
            }
      });

      const response = await fetch(apis.askGPT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(encryptedPayload),
      });

      const data = await response.json();
      let responseText = "";

      if (data.encrypted) {
        const decrypted = decryptResponse(data);
        responseText = decrypted.answer || "No answer received";
      } else {
        responseText = data.answer || "No answer received";
      }

      // Extract code blocks
      const extractedCode = extractCodeBlocks(responseText);
      
      return {
        answer: responseText,
        codeAnswer: extractedCode
      };
    } catch (error) {
      return rejectWithValue("Error fetching answer: " + error.message);
    }
  }
);


// Async thunk for collecting device info
export const collectDeviceInfo = createAsyncThunk(
  'compiler/collectDeviceInfo',
  async (_, { rejectWithValue }) => {
    try {
      // Get IP address using a public API
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const ipData = await ipResponse.json();
      
      const deviceId = localStorage.getItem('device_id') || generateDeviceId();
      
      // Store device ID if not already stored
      if (!localStorage.getItem('device_id')) {
        localStorage.setItem('device_id', deviceId);
      }
      
      return {
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        ip: ipData.ip,
        language: navigator.language,
        deviceId
      };
    } catch (error) {
      // Fallback if IP fetch fails
      const deviceId = localStorage.getItem('device_id') || generateDeviceId();
      
      if (!localStorage.getItem('device_id')) {
        localStorage.setItem('device_id', deviceId);
      }
      
      return {
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        language: navigator.language,
        deviceId
      };
    }
  }
);

// Create the slice
const compilerSlice = createSlice({
  name: 'compiler',
  initialState,
  reducers: {
    setSelectedLanguage: (state, action) => {
        state.selectedLanguage = action.payload;
        // Update code editor placeholder based on language
        state.code = getDefaultCodeForLanguage(action.payload);
    },
    setLanguageFromPath: (state, action) => {
      state.selectedLanguage = action.payload;
      // You might want to also update code template based on language
      state.code = getDefaultCodeForLanguage(action.payload);
    },
    setLanguageDetails: (state, action) => {
    state.languageDetails = action.payload;
    },
    setCode: (state, action) => {
      state.code = action.payload;
    },
    setOutput: (state, action) => {
      state.output = action.payload;
    },
    setEditor: (state, action) => {
        state.editorInstance = action.payload;
    },
    appendOutput: (state, action) => {
      const delimiter = state.output ? "\n\n--- Delayed Output ---\n" : "--- Delayed Output ---\n";
      state.output += delimiter + action.payload;
    },
    setQuestion: (state, action) => {
      state.question = action.payload;
    },
    toggleQuestionInput: (state, action) => {
      state.isQuestionInputVisible = action.payload !== undefined ? action.payload : !state.isQuestionInputVisible;
      if (action.payload === false) {
        state.question = "";
      }
    },
    toggleAnswer: (state, action) => {
      state.showAnswer = action.payload !== undefined ? action.payload : !state.showAnswer;
    },
    setCursorPosition: (state, action) => {
      state.cursorPosition = action.payload;
    },
    setAnswerPosition: (state, action) => {
      state.answerPosition = action.payload;
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    setMobileView: (state, action) => {
      state.isMobileView = action.payload;
      if (action.payload && !state.isMobileView) {
        state.activeTab = "editor";
      }
    },
    toggleFeedback: (state, action) => {
      state.showFeedback = action.payload !== undefined ? action.payload : !state.showFeedback;
    },
    updateDeviceTimestamp: (state) => {
      state.deviceInfo.timestamp = new Date().toISOString();
    },
    resetQuestion: (state) => {
      state.question = "";
      state.isQuestionInputVisible = false;
      state.showAnswer = false;
    },
    setSocketId: (state, action) => {
      state.socketId = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle runCode
      .addCase(runCode.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(runCode.fulfilled, (state, action) => {
        state.isLoading = false;
        state.output = action.payload;
        if (state.isMobileView) {
          state.activeTab = "output";
        }
      })
      .addCase(runCode.rejected, (state, action) => {
        state.isLoading = false;
        console.log("action",action.payload)
        state.output = action.payload || "Error running code";
      })
      // handle fetchRuntimes
      .addCase(fetchRuntimes.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchRuntimes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.runtimes = action.payload
      })
      .addCase(fetchRuntimes.rejected, (state, action) => {
        state.isLoading = false;
      })
      
      // Handle askQuestion
      .addCase(askQuestion.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(askQuestion.fulfilled, (state, action) => {
        state.isLoading = false;
        state.answer = action.payload.answer;
        state.codeAnswer = action.payload.codeAnswer;
        state.showAnswer = true;
        state.isQuestionInputVisible = false;
        state.question = "";
      })
      .addCase(askQuestion.rejected, (state, action) => {
        state.isLoading = false;
        state.answer = action.payload || "Error fetching answer";
        state.showAnswer = true;
        state.question = "";
      })
      
      // Handle collectDeviceInfo
      .addCase(collectDeviceInfo.fulfilled, (state, action) => {
        state.deviceInfo = action.payload;
      });
  }
});

// Export actions
export const {
    setSelectedLanguage,
    setLanguageFromPath,
    setCode,
    setOutput,
    setEditor,
    appendOutput,
    setQuestion,
    toggleQuestionInput,
    toggleAnswer,
    setCursorPosition,
    setAnswerPosition,
    setActiveTab,
    setMobileView,
    toggleFeedback,
    updateDeviceTimestamp,
    resetQuestion,
    setSocketId
} = compilerSlice.actions;

// Export selectors
export const selectSelectedLanguage = (state) => state.compiler.selectedLanguage;
export const selectCode = (state) => state.compiler.code;
export const selectOutput = (state) => state.compiler.output;
export const selectIsLoading = (state) => state.compiler.isLoading;
export const selectQuestion = (state) => state.compiler.question;
export const selectIsQuestionInputVisible = (state) => state.compiler.isQuestionInputVisible;
export const selectAnswer = (state) => state.compiler.answer;
export const selectCodeAnswer = (state) => state.compiler.codeAnswer;
export const selectShowAnswer = (state) => state.compiler.showAnswer;
export const selectCursorPosition = (state) => state.compiler.cursorPosition;
export const selectAnswerPosition = (state) => state.compiler.answerPosition;
export const selectActiveTab = (state) => state.compiler.activeTab;
export const selectIsMobileView = (state) => state.compiler.isMobileView;
export const selectShowFeedback = (state) => state.compiler.showFeedback;
export const selectDeviceInfo = (state) => state.compiler.deviceInfo;
export const selectSocketId = (state) => state.compiler.socketId;
export const selectEditorInstance = (state) => state.compiler.editorInstance;
export const getEditorInstance = () => editorInstance;
export default compilerSlice.reducer;