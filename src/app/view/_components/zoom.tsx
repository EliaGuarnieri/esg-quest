import {
  SpecialZoomLevel,
  useIsomorphicLayoutEffect,
} from "@react-pdf-viewer/core";
import {
  type RenderZoomOutProps,
  type RenderZoomProps,
  zoomPlugin,
  type ZoomProps,
} from "@react-pdf-viewer/zoom";
import { ZoomIn as ZommInIcon, ZoomOut as ZoomOutIcon } from "lucide-react";
import {
  type JSXElementConstructor,
  type ReactElement,
  useContext,
} from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { PluginsInstance } from "../_context";

type ZoomDropdownMenuItemProps = {
  scale: number | SpecialZoomLevel;
  label: string;
  Zoom: (
    props: ZoomProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ) => ReactElement<any, string | JSXElementConstructor<any>>;
};

const ZoomDropdownMenuItem = (props: ZoomDropdownMenuItemProps) => {
  const { scale, Zoom, label } = props;
  return (
    <DropdownMenuItem className="cursor-pointer py-0 text-xs">
      <Zoom>
        {(props: RenderZoomProps) => (
          <Button
            variant="ghost"
            className="p-0"
            onClick={() => props.onZoom(scale)}
          >
            {label}
          </Button>
        )}
      </Zoom>
    </DropdownMenuItem>
  );
};

export const Zoom = () => {
  const zoomPluginInstance = zoomPlugin();
  const { CurrentScale, ZoomIn, ZoomOut, Zoom } = zoomPluginInstance;

  const { setPlugins } = useContext(PluginsInstance);
  useIsomorphicLayoutEffect(() => {
    setPlugins((plugins) => {
      if (plugins.includes(zoomPluginInstance)) {
        return plugins;
      }
      return [...plugins, zoomPluginInstance];
    });
  }, []);

  return (
    <div className="flex items-center rounded-md bg-accent px-1">
      <ZoomOut>
        {(props: RenderZoomOutProps) => (
          <Button
            variant="ghost"
            className="h-auto p-2"
            onClick={props.onClick}
          >
            <ZoomOutIcon className="h-4 w-4" />
          </Button>
        )}
      </ZoomOut>

      <DropdownMenu>
        <DropdownMenuTrigger className="h-8 w-16 rounded-md bg-input text-sm">
          <CurrentScale />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Zoom level</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <ZoomDropdownMenuItem
            scale={SpecialZoomLevel.ActualSize}
            Zoom={Zoom}
            label="Actual size"
          />
          <ZoomDropdownMenuItem
            scale={SpecialZoomLevel.PageFit}
            Zoom={Zoom}
            label="Page fit"
          />
          <ZoomDropdownMenuItem
            scale={SpecialZoomLevel.PageWidth}
            Zoom={Zoom}
            label="Page width"
          />
          <DropdownMenuSeparator />
          <ZoomDropdownMenuItem scale={0.25} Zoom={Zoom} label="25%" />
          <ZoomDropdownMenuItem scale={0.5} Zoom={Zoom} label="50%" />
          <ZoomDropdownMenuItem scale={0.75} Zoom={Zoom} label="75%" />
          <ZoomDropdownMenuItem scale={1} Zoom={Zoom} label="100%" />
          <ZoomDropdownMenuItem scale={1.25} Zoom={Zoom} label="125%" />
          <ZoomDropdownMenuItem scale={1.5} Zoom={Zoom} label="150%" />
          <ZoomDropdownMenuItem scale={2} Zoom={Zoom} label="200%" />
        </DropdownMenuContent>
      </DropdownMenu>

      <ZoomIn>
        {(props: RenderZoomOutProps) => (
          <Button
            variant="ghost"
            className="h-auto p-2"
            onClick={props.onClick}
          >
            <ZommInIcon className="h-4 w-4" />
          </Button>
        )}
      </ZoomIn>
    </div>
  );
};
