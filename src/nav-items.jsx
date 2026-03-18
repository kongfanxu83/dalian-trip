import { HomeIcon, Heart, Route, Map, User, Search, TrendingUp, Calendar, Compass, MapPin, Settings, Plus } from "lucide-react";
import Index from "./pages/Index.jsx";
import Favorites from "./pages/Favorites.jsx";
import TripPlanner from "./pages/TripPlanner.jsx";
import MapPage from "./pages/Map.jsx";
import Profile from "./pages/Profile.jsx";
import SearchPage from "./pages/SearchPage.jsx";
import RankingPage from "./pages/RankingPage.jsx";
import MyTrips from "./pages/MyTrips.jsx";
import DiscoveryHall from "./pages/DiscoveryHall.jsx";
import Footprint from "./pages/Footprint.jsx";
import SettingsPage from "./pages/Settings.jsx";
import AddTripPage from "./pages/AddTripPage.jsx";
import TripRoutePreview from "./pages/TripRoutePreview.jsx";
import MerchantDetail from "./pages/MerchantDetail.jsx";

/**
 * Central place for defining the navigation items. Used for navigation components and routing.
 */
export const navItems = [
  {
    title: "Home",
    to: "/",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <Index />,
  },
  {
    title: "榜单",
    to: "/ranking",
    icon: <TrendingUp className="h-4 w-4" />,
    page: <RankingPage />,
  },
  {
    title: "Map",
    to: "/map",
    icon: <Map className="h-4 w-4" />,
    page: <MapPage />,
  },
  {
    title: "Favorites",
    to: "/favorites",
    icon: <Heart className="h-4 w-4" />,
    page: <Favorites />,
  },
  {
    title: "Trip Planner",
    to: "/trip-planner",
    icon: <Route className="h-4 w-4" />,
    page: <TripPlanner />,
  },
  {
    title: "Profile",
    to: "/profile",
    icon: <User className="h-4 w-4" />,
    page: <Profile />,
  },
  {
    title: "Search",
    to: "/search",
    icon: <Search className="h-4 w-4" />,
    page: <SearchPage />,
  },
  {
    title: "My Trips",
    to: "/my-trips",
    icon: <Calendar className="h-4 w-4" />,
    page: <MyTrips />,
  },
  {
    title: "发现大厅",
    to: "/discovery-hall",
    icon: <Compass className="h-4 w-4" />,
    page: <DiscoveryHall />,
  },
  {
    title: "足迹",
    to: "/footprint",
    icon: <MapPin className="h-4 w-4" />,
    page: <Footprint />,
  },
  {
    title: "设置",
    to: "/settings",
    icon: <Settings className="h-4 w-4" />,
    page: <SettingsPage />,
  },
  {
    title: "添加行程",
    to: "/add-trip",
    icon: <Plus className="h-4 w-4" />,
    page: <AddTripPage />,
  },
  {
    title: "路线预览",
    to: "/trip-route-preview",
    icon: <Route className="h-4 w-4" />,
    page: <TripRoutePreview />,
  },
  {
    title: "商家详情",
    to: "/merchant/:id",
    icon: <MapPin className="h-4 w-4" />,
    page: <MerchantDetail />,
  },
];
