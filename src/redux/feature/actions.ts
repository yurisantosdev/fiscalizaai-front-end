import ActionsFeaturesType from "./actionTypes";
import { FeaturesConsultaType } from "@/types/FeaturesType";

export const setFeature = (feature: FeaturesConsultaType) => ({
  type: ActionsFeaturesType.SET,
  ...feature
})