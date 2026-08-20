import React from "react";
import {
  CallControlsContainer,
  LanguageSelect,
  CallButton,
} from "./StyledCallControls";

export default function CallControls({
  callActive,
  onStart,
  onEnd,
  language,
  onLanguageChange,
}) {
  return (
    <CallControlsContainer>
      <LanguageSelect
        value={language}
        onChange={(e) => onLanguageChange(e.target.value)}
        disabled={callActive}
      >
        <option value="en">English</option>
        <option value="hi">हिन्दी (Hindi)</option>
      </LanguageSelect>

      {!callActive ? (
        <CallButton $variant="start" onClick={onStart}>
          Start Call
        </CallButton>
      ) : (
        <CallButton $variant="end" onClick={onEnd}>
          End Call
        </CallButton>
      )}
    </CallControlsContainer>
  );
}
