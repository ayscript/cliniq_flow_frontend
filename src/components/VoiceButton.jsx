export default function VoiceButton() {
  return (
    <button
      className="border p-2 rounded w-full"
      onClick={() => alert("Voice input demo")}
    >
      🎤 Voice Input
    </button>
  );
}
