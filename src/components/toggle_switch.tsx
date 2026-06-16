import React from "react";

export default function ToggleSwitch({
  onClick,
}: {
  onClick: (checked: boolean) => void;
}) {

const [isChecked, setIsChecked] = React.useState(false);

const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const checked = event.target.checked;
  setIsChecked(checked);
  onClick(checked);
};

const switchStyle: React.CSSProperties = {
  position: "relative",
  display: "inline-block",
  width: "60px",
  height: "34px",
};

const sliderStyle: React.CSSProperties = {
  position: "absolute",
  cursor: "pointer",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: isChecked ? "#2196F3" : "#ccc",
  transition: ".4s",
};

const sliderBeforeStyle: React.CSSProperties = {
  position: "absolute",
  content: '""',
  height: "26px",
  width: "26px",
  left: isChecked ? "30px" : "4px",
  bottom: "4px",
  backgroundColor: "white",
  transition: ".4s",
};




	return <label className="switch">
  <input type="checkbox" checked={isChecked} onChange={handleChange} />
  <span className="slider round"></span>
</label>
}
