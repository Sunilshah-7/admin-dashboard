import "./Home.css";
import FeaturedInfo from "../../components/FeaturedInfo/FeaturedInfo";
import Chart from "../../components/Chart/Chart";
import { userData } from "../../DummyData";
import WidgetLarge from "../../components/WidgetLarge/WidgetLarge";
import WidgetSmall from "../../components/WidgetSmall/WidgetSmall";
export default function Home() {
  return (
    <div className="home">
      <FeaturedInfo />
      <Chart
        title="User Analytics"
        data={userData}
        dataKey="Active User"
        grid
      />
      <div className="widgets">
        <WidgetSmall />
        <WidgetLarge />
      </div>
    </div>
  );
}
