import React from "react";
import "./Topbar.css";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";

export default function Topbar() {
  return (
    <div className="topbar">
      <div className="topbarWrapper">
        <div className="topbarLeft">
          <span className="logo">Admin Panel</span>
        </div>
        <div className="topbarRight">
          <div className="topbarIconContainer">
            <NotificationsOutlinedIcon />
            <span className="topbarIconBadge">2</span>
          </div>
          <div className="topbarIconContainer">
            <LanguageOutlinedIcon />
            <span className="topbarIconBadge">2</span>
          </div>
          <div className="topbarIconContainer">
            <SettingsOutlinedIcon />
          </div>
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_wRwK8gNjNOr2aB5roetnKPA7TtegKrNb6w&usqp=CAU"
            alt="profile"
            className="profilePic"
          />
        </div>
      </div>
    </div>
  );
}
