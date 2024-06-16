import { useIsomorphicLayoutEffect } from "@react-pdf-viewer/core";
import {
  pageNavigationPlugin,
  type RenderCurrentPageLabelProps,
  type RenderGoToPageProps,
} from "@react-pdf-viewer/page-navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useContext } from "react";

import { PluginsInstance } from "@/app/view/_context";
import { Button, type ButtonProps } from "@/components/ui/button";

import { CurrentPageInput } from "./current-page-input";

type NavigationButtonProps = ButtonProps &
  React.RefAttributes<HTMLButtonElement>;

const NavigationButton = (props: NavigationButtonProps) => {
  return <Button variant="ghost" {...props} className="p-0" />;
};

export const PageNavigation = () => {
  const pageNavigationPluginInstance = pageNavigationPlugin();
  const {
    GoToNextPage,
    GoToPreviousPage,
    NumberOfPages,
    CurrentPageLabel,
    // eslint-disable-next-line @typescript-eslint/unbound-method
    jumpToNextPage,
    jumpToPage,
    // eslint-disable-next-line @typescript-eslint/unbound-method
    jumpToPreviousPage,
  } = pageNavigationPluginInstance;

  const { setPlugins } = useContext(PluginsInstance);
  useIsomorphicLayoutEffect(() => {
    setPlugins((plugins) => {
      if (plugins.includes(pageNavigationPluginInstance)) {
        return plugins;
      }
      return [...plugins, pageNavigationPluginInstance];
    });
  }, []);

  return (
    <div className="flex items-center gap-4 rounded-md bg-accent px-2 text-sm text-foreground">
      <GoToPreviousPage>
        {(props: RenderGoToPageProps) => (
          <NavigationButton disabled={props.isDisabled} onClick={props.onClick}>
            <ChevronLeft className="h-4 w-4" /> Previous
          </NavigationButton>
        )}
      </GoToPreviousPage>
      <div className="flex items-center gap-1">
        <span>Page </span>
        <CurrentPageLabel>
          {(props: RenderCurrentPageLabelProps) => (
            <CurrentPageInput
              currentPage={props.currentPage}
              numberOfPages={props.numberOfPages}
              jumpToPage={jumpToPage}
              jumpToNextPage={jumpToNextPage}
              jumpToPreviousPage={jumpToPreviousPage}
            />
          )}
        </CurrentPageLabel>
        <span>of </span>
        <NumberOfPages />
      </div>
      <GoToNextPage>
        {(props: RenderGoToPageProps) => (
          <NavigationButton disabled={props.isDisabled} onClick={props.onClick}>
            Next <ChevronRight className="h-4 w-4" />
          </NavigationButton>
        )}
      </GoToNextPage>
    </div>
  );
};
