import React from "react";
import "./Sidebar.css";
import LineStyleIcon from "@mui/icons-material/LineStyle";
import TimelineIcon from "@mui/icons-material/Timeline";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import MailOutlinedIcon from "@mui/icons-material/MailOutlined";
import DynamicFeedOutlinedIcon from "@mui/icons-material/DynamicFeedOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import ReportGmailerrorredOutlinedIcon from "@mui/icons-material/ReportGmailerrorredOutlined";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Dashboard</h3>
          <ul className="sidebarList">
            <li className="sidebarItem active">
              <LineStyleIcon className="sidebarIcon" />
              <span>Home</span>
            </li>
            <li className="sidebarItem">
              <TimelineIcon className="sidebarIcon" />
              <span>Analytics</span>
            </li>
            <li className="sidebarItem">
              <TrendingUpIcon className="sidebarIcon" />
              <span>Sales</span>
            </li>
          </ul>
        </div>
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Quick Menu</h3>
          <ul className="sidebarList">
            <li className="sidebarItem">
              <PersonOutlineOutlinedIcon className="sidebarIcon" />
              <span>Users</span>
            </li>
            <li className="sidebarItem">
              <StorefrontOutlinedIcon className="sidebarIcon" />
              <span>Products</span>
            </li>
            <li className="sidebarItem">
              <AttachMoneyOutlinedIcon className="sidebarIcon" />
              <span>Transactions</span>
            </li>
            <li className="sidebarItem">
              <AssessmentOutlinedIcon className="sidebarIcon" />
              <span>Reports</span>
            </li>
          </ul>
        </div>

        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Notifications</h3>
          <ul className="sidebarList">
            <li className="sidebarItem ">
              <MailOutlinedIcon className="sidebarIcon" />
              <span>Mail</span>
            </li>
            <li className="sidebarItem">
              <DynamicFeedOutlinedIcon className="sidebarIcon" />
              <span>Feedback</span>
            </li>
            <li className="sidebarItem">
              <ChatBubbleOutlineOutlinedIcon className="sidebarIcon" />
              <span>Messages</span>
            </li>
          </ul>
        </div>

        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Staff</h3>
          <ul className="sidebarList">
            <li className="sidebarItem">
              <WorkOutlineOutlinedIcon className="sidebarIcon" />
              <span>Manage</span>
            </li>
            <li className="sidebarItem">
              <TimelineIcon className="sidebarIcon" />
              <span>Analytics</span>
            </li>
            <li className="sidebarItem">
              <ReportGmailerrorredOutlinedIcon className="sidebarIcon" />
              <span>Reports</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
