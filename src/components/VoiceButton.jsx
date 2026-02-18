export default function VoiceButton() {
  return (
    <button
      type="button"
      className="flex items-center justify-center gap-2 border rounded p-2 w-full"
      onClick={() => alert("Voice input demo")}
    >
      🎤 Voice Input
    </button>
  );
}
