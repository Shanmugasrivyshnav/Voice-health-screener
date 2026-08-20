import React from "react";
import {
  TranscriptContainer,
  TranscriptEmpty,
  TranscriptRow,
  TranscriptSpeaker,
  TranscriptText,
} from "./StyledTranscript";

export default function Transcript({ messages }) {
  if (!messages.length) {
    return (
      <TranscriptEmpty>
        The transcript will appear here once the call starts.
      </TranscriptEmpty>
    );
  }

  return (
    <TranscriptContainer>
      {messages.map((message, index) => (
        <TranscriptRow key={index} $role={message.role}>
          <TranscriptSpeaker $role={message.role}>
            {message.role === "user" ? "You" : "Assistant"}
          </TranscriptSpeaker>

          <TranscriptText>{message.content}</TranscriptText>
        </TranscriptRow>
      ))}
    </TranscriptContainer>
  );
}
