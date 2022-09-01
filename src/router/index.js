import Vue from "vue";
import VueRouter from "vue-router";

class Meta {
  constructor(requiresAuth, type, admin) {
    this.requiresAuth = requiresAuth;
    this.type = type;
    this.admin = admin;
  }
}
Vue.use(VueRouter);

const routes = [
  {
    path: "*",
    name: "Default",
    meta: new Meta(false, 0, false),
    redirect: { name: "Login" },
  },
  {
    path: "/",
    name: "Root",
    meta: new Meta(false, 0, false),
    // redirect: { name: "Login" },
    component: () => import("@/views/Workguide/Login"),
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/Workguide/Login"),
    meta: new Meta(false, 0, false),
  },
  {
    path: "/home",
    name: "Home",
    component: () => import("@/views/Workguide/Home"),
    meta: new Meta(true, 2, false),
  },
  {
    path: "/workflow/:uuid",
    name: "Workflow",
    component: () => import("@/views/Workguide/Workflow"),
    meta: new Meta(true, 2, false),
    props: true,
  },
  {
    path: "/workflow/:uuid/:version",
    name: "WorkflowByVersion",
    component: () => import("@/views/Workguide/Workflow"),
    meta: new Meta(true, 2, false),
    props: true,
  },
  {
    path: "/workflow_management",
    name: "WorkflowManagement",
    component: () => import("@/views/Workguide/WorkflowManagement"),
    meta: new Meta(true, 2, false),
  },
  {
    path: "/workflow_record",
    name: "WorkflowRecord",
    component: () => import("@/views/Workguide/WorkflowRecord"),
    meta: new Meta(true, 2, false),
  },
  {
    path: "/equipment_management",
    name: "EquipmentManagement",
    component: () => import("@/views/Workguide/EquipmentManagement"),
    meta: new Meta(true, 2, false),
  },
  {
    path: "/type_management",
    name: "TypeManagement",
    component: () => import("@/views/Workguide/TypeManagement"),
    meta: new Meta(true, 2, false),
  },
  {
    path: "/location_management",
    name: "LocationManagement",
    component: () => import("@/views/Workguide/LocationManagement"),
    meta: new Meta(true, 2, false),
  },
  {
    path: "/file_management",
    name: "FileManagement",
    component: () => import("@/views/Workguide/FileManagement"),
    meta: new Meta(true, 2, false),
  },
  {
    path: "/user_management",
    name: "UserManagement",
    component: () => import("@/views/Workguide/UserManagement"),
    meta: new Meta(true, 2, false),
  },
  {
    path: "/task_management",
    name: "TaskManagement",
    component: () => import("@/views/Workguide/TaskManagement"),
    meta: new Meta(true, 2, false),
  },
  {
    path: "/qrcode",
    name: "QRCode",
    component: () => import("@/views/Workguide/QRCode"),
    meta: new Meta(true, 2, false),
  },
  {
    path: "/settings",
    name: "Settings",
    component: () => import("@/views/Workguide/Settings"),
    meta: new Meta(true, 2, false),
  },
  {
    path: "/ra",
    meta: new Meta(false, 0, false),
    redirect: { name: "RALogin" },
  },
  {
    path: "/ra/login",
    name: "RALogin",
    component: () => import("@/views/RemoteAssist/Login"),
    meta: new Meta(false, 0, false),
    props: true,
  },
  {
    path: "/ra/resetPassword",
    name: "RAResetPassword",
    component: () => import("@/views/RemoteAssist/ResetPassword"),
    meta: new Meta(false, 0, false),
  },
  {
    path: "/ra/register",
    name: "RARegister",
    component: () => import("@/views/RemoteAssist/Register"),
    meta: new Meta(false, 0, false),
  },
  {
    path: "/ra/contact",
    name: "RAContact",
    component: () => import("@/views/RemoteAssist/Contact"),
    meta: new Meta(true, 1, false),
  },
  {
    path: "/ra/callHistory",
    name: "RACallHistory",
    component: () => import("@/views/RemoteAssist/CallHistory"),
    meta: new Meta(true, 1, false),
  },
  {
    path: "/ra/settings",
    name: "RASettings",
    component: () => import("@/views/RemoteAssist/Settings/Settings"),
    meta: new Meta(true, 1, false),
  },
  {
    path: "/ra/changeEmail",
    name: "RAChangeEmail",
    component: () => import("@/views/RemoteAssist/Settings/ChangeEmail"),
    meta: new Meta(true, 1, false),
  },
  {
    path: "/ra/changePassword",
    name: "RAChangePassword",
    component: () => import("@/views/RemoteAssist/Settings/ChangePassword"),
    meta: new Meta(true, 1, false),
  },
  {
    path: "/ra/qrcode",
    name: "RAQRCode",
    component: () => import("@/views/RemoteAssist/Settings/QRCode"),
    meta: new Meta(true, 1, false),
  },
  {
    path: "/ra/contactUs",
    name: "RAContactUs",
    component: () => import("@/views/RemoteAssist/Settings/ContactUs"),
    meta: new Meta(true, 1, false),
  },
  {
    path: "/ra/rating",
    name: "RARating",
    component: () => import("@/views/RemoteAssist/Settings/Rating"),
    meta: new Meta(true, 1, false),
    props: true,
  },
  {
    path: "/ra/call",
    name: "RACall",
    component: () => import("@/views/RemoteAssist/Call/Call"),
    meta: new Meta(true, 1, false),
    props: true,
  },
  {
    path: "/ra/conference",
    name: "RAConference",
    component: () => import("@/views/RemoteAssist/Conference"),
    meta: new Meta(false, 1, false),
    props: true,
  },
  {
    path: "/ra/privacyPolicy",
    name: "RAPrivacyPolicy",
    component: () => import("@/views/RemoteAssist/Terms/PrivacyPolicy"),
    meta: new Meta(false, 0, false),
  },
  {
    path: "/ra/serviceTerms",
    name: "RAServiceTerms",
    component: () => import("@/views/RemoteAssist/Terms/ServiceTerms"),
    meta: new Meta(false, 0, false),
  },

  {
    path: "/si/login",
    name: "SILogin",
    component: () => import("@/views/SIManagement/Login"),
    meta: new Meta(false, 3, false),
  },
  {
    path: "/si/",
    name: "SIManagement",
    redirect: { name: "SILogin" },
    component: () => import("@/views/SIManagement/Management"),
    meta: new Meta(true, 3, true),
    children: [
      {
        path: "maintenance",
        name: "SIMaintenance",
        component: () => import("@/views/SIManagement/Maintenance"),
        meta: new Meta(true, 3, true),
      },
      {
        path: "enterprise_setting",
        name: "SIEnterpriseSetting",
        component: () => import("@/views/SIManagement/EnterpriseSetting"),
        meta: new Meta(true, 3, true),
      },
      {
        path: "enterprise_account",
        name: "SIEnterpriseAccount",
        component: () => import("@/views/SIManagement/EnterpriseAccount"),
        meta: new Meta(true, 3, true),
      },
      {
        path: "analysis",
        name: "SIAnalysis",
        component: () => import("@/views/SIManagement/Analysis"),
        meta: new Meta(true, 3, true),
      },
      {
        path: "feedback_rating",
        name: "SIFeedbackRating",
        component: () => import("@/views/SIManagement/FeedbackRating"),
        meta: new Meta(true, 3, true),
      },
      {
        path: "feedback_contact_us",
        name: "SIFeedbackContactUs",
        component: () => import("@/views/SIManagement/FeedbackContactUs"),
        meta: new Meta(true, 3, true),
      },
      {
        path: "recorded_video",
        name: "SIRecordedVideo",
        component: () => import("@/views/SIManagement/RecordedVideo"),
        meta: new Meta(true, 3, true),
      },
    ],
  },
  {
    path: "/maintenance",
    name: "Maintenance",
    component: () => import("@/views/Maintenance/Home"),
    meta: new Meta(true, 4, true),
  }
];

const router = new VueRouter({
  // mode: "hash",
  mode: "history",
  //   base: process.env.BASE_URL,
  routes,
});

export default router;
