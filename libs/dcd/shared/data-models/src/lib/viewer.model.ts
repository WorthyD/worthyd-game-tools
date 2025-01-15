import { Observable } from "rxjs/internal/Observable";

export interface ViewerState {
  views: string[];
}

interface RenderedViewWithText {
  text: string;
  classList?: string | string[];
  styles?: { [key in string]: string };
}
interface RenderedWithComponent {
  component: any;
  data: any;
  classList?: string | string[];
  styles?: { [key in string]: string };
}

interface RenderedViewWithChildren {
  children: RenderedView[];
  classList?: string | string[];
  styles?: { [key in string]: string };
}

// export type RenderedView = RenderedViewWithText | RenderedViewWithChildren | RenderedWithComponent;
export interface RenderedView {

  text?: string;
  component?: any;
  data?: any;
  children?: RenderedView[];
  classList?: string | string[];
  styles?: { [key in string]: string };


}

export interface ViewerMetadata<T = any, C = any> {
  label: string;
  tooltip?: string;
  isSticky?: boolean;
  labelClass?: string;
  plainText: (item: T, context: C) => string | null;
  render: (item: T, context: C) => RenderedView | null;
}

export interface ViewLabel {
  id: string;
  isSticky: boolean;
  label: string;
  tooltip?: string;
  labelClass?: string;
}

export type ViewerContextProvider<T, C> = Observable<(item: T) => C>;

export interface ViewerOptions<T, C> {
  metadata?: Map<string, ViewerMetadata<T, C>>;
  contextProvider?: ViewerContextProvider<T, C>;
  initialState?: ViewerState;
}
