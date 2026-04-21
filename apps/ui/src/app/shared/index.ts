// ── Shared Components ──────────────────────────────────────────────────────
export { SpinnerComponent } from './components/spinner.component';
export { SendButtonComponent } from './components/send-button.component';
export { ResetButtonComponent } from './components/reset-button.component';
export {
  ReasoningDropdownComponent,
  ReasoningOption,
  ModelReasoningCapability,
  ALL_REASONING_OPTIONS,
} from './components/reasoning-dropdown.component';

// ── Shared Utils ───────────────────────────────────────────────────────────
export {
  ChatMessage,
  lastIndexWhere,
  patchLast,
  patchByItemId,
  finalizeStreamingMessages,
  safeParseJson,
} from './utils/chat-message.utils';

export {
  AppendedFile,
  fileSizeLabel,
  readFilesAsDataUrls,
  mergeFiles,
} from './utils/file.utils';

export { readStoredTheme, applyTheme } from './utils/theme.utils';
