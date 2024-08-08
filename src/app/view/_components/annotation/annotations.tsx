// Import styles
import "@react-pdf-viewer/highlight/lib/styles/index.css";

import { useIsomorphicLayoutEffect } from "@react-pdf-viewer/core";
import { highlightPlugin } from "@react-pdf-viewer/highlight";
import { useContext } from "react";

import { PluginsInstance } from "@/app/view/_context";

import { HighlightTarget } from "./highlight-target";
import { Highlights } from "./highlights";

export const Annotations = () => {
  const highlightPluginInstance = highlightPlugin({
    renderHighlightTarget: (props) => <HighlightTarget {...props} />,
    renderHighlights: (props) => <Highlights {...props} />,
  });

  const { setPlugins } = useContext(PluginsInstance);
  useIsomorphicLayoutEffect(() => {
    setPlugins((plugins) => {
      if (plugins.includes(highlightPluginInstance)) {
        return plugins;
      }
      return [...plugins, highlightPluginInstance];
    });
  }, []);

  return null;
};
