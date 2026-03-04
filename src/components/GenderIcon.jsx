const GenderIcon = ({ gender, size = 16 }) => (
  <span
    style={{
      color: gender === "male" ? "#3b82f6" : "#ec4899",
      fontSize: size,
      fontWeight: 700,
    }}
  >
    {gender === "male" ? "♂" : "♀"}
  </span>
);

export default GenderIcon;
