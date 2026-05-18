import "./FeaturedInfo.css";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { ArrowUpward } from "@mui/icons-material";

export default function FeaturedInfo() {
  return (
    <div className="featured">
      <div className="featuredItem">
        <span className="featuredTitle">Revenue</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">$2,435</span>
          <span className="featuredMoneyRate">
            -11.4
            <ArrowDownwardIcon className="featuredMoneyIcon negative"/>
          </span>
        </div>
        <span className="featuredSub">Compare to last month</span>
      </div>

      <div className="featuredItem">
        <span className="featuredTitle">Sales</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">$4,435</span>
          <span className="featuredMoneyRate">
            +9.4
            <ArrowUpward className="featuredMoneyIcon "/>
          </span>
        </div>
        <span className="featuredSub">Compare to last month</span>
      </div>

      <div className="featuredItem">
        <span className="featuredTitle">Cost</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">$1,835</span>
          <span className="featuredMoneyRate">
            -5.4
            <ArrowDownwardIcon className="featuredMoneyIcon negative"/>
          </span>
        </div>
        <span className="featuredSub">Compare to last month</span>
      </div>
    </div>
  );
}
