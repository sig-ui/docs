import { mount } from "svelte";
import App from "./App.svelte";
import { defineSiguiComponents } from "@sig-ui/components";

defineSiguiComponents({ tagPrefix: "sg", featureFlags: { checkboxMachine: true } });

mount(App, { target: document.getElementById("app")! });
