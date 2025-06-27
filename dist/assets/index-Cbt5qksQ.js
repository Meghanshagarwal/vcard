import { r as reactExports, j as jsxRuntimeExports, V as Viewport, R as Root2, A as Action, C as Close, X, T as Title, D as Description, P as Provider, a as Content2, b as Provider$1, S as Slot, c as useDropzone, d as CloudUpload, F as FileText, e as CircleCheckBig, f as Download, h as Trigger, I as Icon, i as ChevronDown, k as ScrollUpButton, l as ChevronUp, m as ScrollDownButton, n as Portal, o as Content2$1, p as Viewport$1, L as Label, q as Item, s as ItemIndicator, t as Check, v as ItemText, w as Separator, x as Root2$1, y as Value, z as useMutation, B as ArrowRight, U as User, M as Mail, E as Phone, G as Building, H as Briefcase, J as Globe, K as Root, N as Indicator, O as useQuery, Q as Play, W as Clock, Y as CircleAlert, Z as RotateCcw, _ as Share, $ as Eye, a0 as QrCode, a1 as CircleHelp, a2 as ArrowLeft, a3 as QueryClientProvider, a4 as createRoot } from "./react-vendor-DLXXOHaU.js";
import { v as QueryClient, w as twMerge, x as clsx, y as cva, z as useRoute, S as Switch, R as Route } from "./vendor-a4Wdxy6o.js";
import "./ui-UJNVxv2C.js";
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
async function throwIfResNotOk(res) {
  if (!res.ok) {
    const text = await res.text() || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}
async function apiRequest(method, url, data) {
  const baseUrl = "https://vcard-backend-eight.vercel.app";
  const fullUrl = url.startsWith("http") ? url : `${baseUrl}${url}`;
  const isFormData = data instanceof FormData;
  const res = await fetch(fullUrl, {
    method,
    headers: data && !isFormData ? { "Content-Type": "application/json" } : {},
    body: isFormData ? data : data ? JSON.stringify(data) : void 0,
    credentials: "include"
  });
  await throwIfResNotOk(res);
  return res;
}
const getQueryFn = ({ on401: unauthorizedBehavior }) => async ({ queryKey }) => {
  const baseUrl = "https://vcard-backend-eight.vercel.app";
  const url = queryKey[0].startsWith("http") ? queryKey[0] : `${baseUrl}${queryKey[0]}`;
  const res = await fetch(url, {
    credentials: "include"
  });
  if (unauthorizedBehavior === "returnNull" && res.status === 401) {
    return null;
  }
  await throwIfResNotOk(res);
  return await res.json();
};
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false
    },
    mutations: {
      retry: false
    }
  }
});
const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1e6;
let count = 0;
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}
const toastTimeouts = /* @__PURE__ */ new Map();
const addToRemoveQueue = (toastId) => {
  if (toastTimeouts.has(toastId)) {
    return;
  }
  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: "REMOVE_TOAST",
      toastId
    });
  }, TOAST_REMOVE_DELAY);
  toastTimeouts.set(toastId, timeout);
};
const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT)
      };
    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map(
          (t) => t.id === action.toast.id ? { ...t, ...action.toast } : t
        )
      };
    case "DISMISS_TOAST": {
      const { toastId } = action;
      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        state.toasts.forEach((toast2) => {
          addToRemoveQueue(toast2.id);
        });
      }
      return {
        ...state,
        toasts: state.toasts.map(
          (t) => t.id === toastId || toastId === void 0 ? {
            ...t,
            open: false
          } : t
        )
      };
    }
    case "REMOVE_TOAST":
      if (action.toastId === void 0) {
        return {
          ...state,
          toasts: []
        };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId)
      };
  }
};
const listeners = [];
let memoryState = { toasts: [] };
function dispatch(action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}
function toast({ ...props }) {
  const id = genId();
  const update = (props2) => dispatch({
    type: "UPDATE_TOAST",
    toast: { ...props2, id }
  });
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });
  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss();
      }
    }
  });
  return {
    id,
    dismiss,
    update
  };
}
function useToast() {
  const [state, setState] = reactExports.useState(memoryState);
  reactExports.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);
  return {
    ...state,
    toast,
    dismiss: (toastId) => dispatch({ type: "DISMISS_TOAST", toastId })
  };
}
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const ToastProvider = Provider;
const ToastViewport = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Viewport,
  {
    ref,
    className: cn(
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className
    ),
    ...props
  }
));
ToastViewport.displayName = Viewport.displayName;
const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        destructive: "destructive group border-destructive bg-destructive text-destructive-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
const Toast = reactExports.forwardRef(({ className, variant, ...props }, ref) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root2,
    {
      ref,
      className: cn(toastVariants({ variant }), className),
      ...props
    }
  );
});
Toast.displayName = Root2.displayName;
const ToastAction = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Action,
  {
    ref,
    className: cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",
      className
    ),
    ...props
  }
));
ToastAction.displayName = Action.displayName;
const ToastClose = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Close,
  {
    ref,
    className: cn(
      "absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
      className
    ),
    "toast-close": "",
    ...props,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
  }
));
ToastClose.displayName = Close.displayName;
const ToastTitle = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Title,
  {
    ref,
    className: cn("text-sm font-semibold", className),
    ...props
  }
));
ToastTitle.displayName = Title.displayName;
const ToastDescription = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Description,
  {
    ref,
    className: cn("text-sm opacity-90", className),
    ...props
  }
));
ToastDescription.displayName = Description.displayName;
function Toaster() {
  const { toasts } = useToast();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(ToastProvider, { children: [
    toasts.map(function({ id, title, description, action, ...props }) {
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(Toast, { ...props, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1", children: [
          title && /* @__PURE__ */ jsxRuntimeExports.jsx(ToastTitle, { children: title }),
          description && /* @__PURE__ */ jsxRuntimeExports.jsx(ToastDescription, { children: description })
        ] }),
        action,
        /* @__PURE__ */ jsxRuntimeExports.jsx(ToastClose, {})
      ] }, id);
    }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ToastViewport, {})
  ] });
}
const TooltipProvider = Provider$1;
const TooltipContent = reactExports.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Content2,
  {
    ref,
    sideOffset,
    className: cn(
      "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-tooltip-content-transform-origin]",
      className
    ),
    ...props
  }
));
TooltipContent.displayName = Content2.displayName;
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const Button = reactExports.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Comp,
      {
        className: cn(buttonVariants({ variant, size, className })),
        ref,
        ...props
      }
    );
  }
);
Button.displayName = "Button";
const Card = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "div",
  {
    ref,
    className: cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    ),
    ...props
  }
));
Card.displayName = "Card";
const CardHeader = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "div",
  {
    ref,
    className: cn("flex flex-col space-y-1.5 p-6", className),
    ...props
  }
));
CardHeader.displayName = "CardHeader";
const CardTitle = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "div",
  {
    ref,
    className: cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    ),
    ...props
  }
));
CardTitle.displayName = "CardTitle";
const CardDescription = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "div",
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
CardDescription.displayName = "CardDescription";
const CardContent = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref, className: cn("p-6 pt-0", className), ...props }));
CardContent.displayName = "CardContent";
const CardFooter = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "div",
  {
    ref,
    className: cn("flex items-center p-6 pt-0", className),
    ...props
  }
));
CardFooter.displayName = "CardFooter";
function FileUpload({ onUploadComplete }) {
  const [isUploading, setIsUploading] = reactExports.useState(false);
  const { toast: toast2 } = useToast();
  const onDrop = reactExports.useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;
    const file = acceptedFiles[0];
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await apiRequest("POST", "/api/upload", formData);
      const result = await response.json();
      onUploadComplete(result);
      toast2({
        title: "File uploaded successfully",
        description: `${result.totalContacts} contacts found in ${file.name}`
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast2({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload file",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  }, [onUploadComplete, toast2]);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "application/vnd.ms-excel": [".xls"]
    },
    maxSize: 10 * 1024 * 1024,
    // 10MB
    multiple: false
  });
  const downloadTemplate = async () => {
    try {
      const response = await fetch("/api/template/download");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "vcard-template.csv";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      toast2({
        title: "Download failed",
        description: "Failed to download template",
        variant: "destructive"
      });
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CloudUpload, { className: "text-primary-custom h-8 w-8" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-semibold text-primary-custom mb-2", children: "Upload Your Contact File" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-600 mb-6", children: "Drag and drop your CSV or Excel file here, or click to browse" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          ...getRootProps(),
          className: `border-2 border-dashed rounded-lg p-12 transition-colors cursor-pointer ${isDragActive ? "border-primary-custom bg-primary/5" : "border-gray-300 hover:border-primary-custom hover:bg-primary/5"}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ...getInputProps() }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-12 w-12 text-gray-400 mx-auto mb-4" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-medium text-primary-custom mb-2", children: isDragActive ? "Drop your file here" : "Drop your file here" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-500 mb-4", children: "Supports CSV, XLSX, XLS files up to 10MB" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  disabled: isUploading,
                  className: "bg-primary-custom hover:bg-primary/90",
                  children: isUploading ? "Uploading..." : "Choose File"
                }
              )
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex items-center justify-center space-x-6 text-sm text-gray-500", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-4 w-4 text-success-custom mr-2" }),
          "CSV Format"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-4 w-4 text-success-custom mr-2" }),
          "Excel (.xlsx, .xls)"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-4 w-4 text-success-custom mr-2" }),
          "Up to 10MB"
        ] })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-primary-custom mb-2", children: "Need a template?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-600 mb-4", children: "Download our sample CSV template with the correct column headers" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2 text-sm text-gray-500", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-gray-100 px-2 py-1 rounded", children: "Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-gray-100 px-2 py-1 rounded", children: "Email" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-gray-100 px-2 py-1 rounded", children: "Primary Phone" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-gray-100 px-2 py-1 rounded", children: "Secondary Phone" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-gray-100 px-2 py-1 rounded", children: "Company" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-gray-100 px-2 py-1 rounded", children: "Position" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-gray-100 px-2 py-1 rounded", children: "Website" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          onClick: downloadTemplate,
          className: "bg-secondary-custom hover:bg-secondary/90",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4 mr-2" }),
            "Download Template"
          ]
        }
      )
    ] }) }) })
  ] });
}
const Select = Root2$1;
const SelectValue = Value;
const SelectTrigger = reactExports.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  Trigger,
  {
    ref,
    className: cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4 opacity-50" }) })
    ]
  }
));
SelectTrigger.displayName = Trigger.displayName;
const SelectScrollUpButton = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  ScrollUpButton,
  {
    ref,
    className: cn(
      "flex cursor-default items-center justify-center py-1",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "h-4 w-4" })
  }
));
SelectScrollUpButton.displayName = ScrollUpButton.displayName;
const SelectScrollDownButton = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  ScrollDownButton,
  {
    ref,
    className: cn(
      "flex cursor-default items-center justify-center py-1",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4" })
  }
));
SelectScrollDownButton.displayName = ScrollDownButton.displayName;
const SelectContent = reactExports.forwardRef(({ className, children, position = "popper", ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(Portal, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
  Content2$1,
  {
    ref,
    className: cn(
      "relative z-50 max-h-[--radix-select-content-available-height] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-select-content-transform-origin]",
      position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
      className
    ),
    position,
    ...props,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectScrollUpButton, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Viewport$1,
        {
          className: cn(
            "p-1",
            position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
          ),
          children
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectScrollDownButton, {})
    ]
  }
) }));
SelectContent.displayName = Content2$1.displayName;
const SelectLabel = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Label,
  {
    ref,
    className: cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className),
    ...props
  }
));
SelectLabel.displayName = Label.displayName;
const SelectItem = reactExports.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  Item,
  {
    ref,
    className: cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ItemIndicator, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4" }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ItemText, { children })
    ]
  }
));
SelectItem.displayName = Item.displayName;
const SelectSeparator = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Separator,
  {
    ref,
    className: cn("-mx-1 my-1 h-px bg-muted", className),
    ...props
  }
));
SelectSeparator.displayName = Separator.displayName;
const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Badge({ className, variant, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn(badgeVariants({ variant }), className), ...props });
}
const vCardFields = [
  { value: "name", label: "Name", icon: User, description: "Contact's full name", required: true },
  { value: "email", label: "Email", icon: Mail, description: "Email address", required: false },
  { value: "phone", label: "Primary Phone", icon: Phone, description: "Main phone number", required: false },
  { value: "phone2", label: "Secondary Phone", icon: Phone, description: "Additional phone number", required: false },
  { value: "company", label: "Organization", icon: Building, description: "Company or organization", required: false },
  { value: "position", label: "Job Title", icon: Briefcase, description: "Position or role", required: false },
  { value: "website", label: "Website", icon: Globe, description: "Website URL", required: false }
];
function FieldMapping({ headers, preview, batchId, onMappingComplete }) {
  const [mapping, setMapping] = reactExports.useState({});
  const { toast: toast2 } = useToast();
  reactExports.useEffect(() => {
    const autoMapping = {};
    headers.forEach((header) => {
      const lowerHeader = header.toLowerCase().trim();
      if (lowerHeader.includes("name") || lowerHeader.includes("full")) {
        autoMapping.name = header;
      } else if (lowerHeader.includes("email") || lowerHeader.includes("mail")) {
        autoMapping.email = header;
      } else if (lowerHeader.includes("phone") && !lowerHeader.includes("2") && !lowerHeader.includes("second")) {
        autoMapping.phone = header;
      } else if (lowerHeader.includes("phone") && (lowerHeader.includes("2") || lowerHeader.includes("second"))) {
        autoMapping.phone2 = header;
      } else if (lowerHeader.includes("company") || lowerHeader.includes("organization") || lowerHeader.includes("org")) {
        autoMapping.company = header;
      } else if (lowerHeader.includes("position") || lowerHeader.includes("title") || lowerHeader.includes("job")) {
        autoMapping.position = header;
      } else if (lowerHeader.includes("website") || lowerHeader.includes("url") || lowerHeader.includes("web")) {
        autoMapping.website = header;
      }
    });
    setMapping(autoMapping);
  }, [headers]);
  const setMappingMutation = useMutation({
    mutationFn: async (data) => {
      const response = await apiRequest("POST", `/api/batches/${batchId}/mapping`, data);
      return response.json();
    },
    onSuccess: () => {
      toast2({
        title: "Field mapping saved",
        description: "Your field mapping has been saved successfully"
      });
      onMappingComplete(mapping);
    },
    onError: (error) => {
      toast2({
        title: "Mapping failed",
        description: error instanceof Error ? error.message : "Failed to save field mapping",
        variant: "destructive"
      });
    }
  });
  const handleMappingChange = (vCardField, csvField) => {
    setMapping((prev) => ({
      ...prev,
      [vCardField]: csvField === "none" ? "" : csvField
    }));
  };
  const handleContinue = () => {
    setMappingMutation.mutate({
      mapping
    });
  };
  const mappedFields = Object.keys(mapping).filter((key) => mapping[key]);
  const hasRequiredMapping = mapping.name;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-5 w-5 text-blue-600" }),
          "Field Mapping"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-600", children: "Connect your CSV columns to contact fields. We've suggested some matches below." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: vCardFields.map((field) => {
          const Icon2 = field.icon;
          const isMapped = mapping[field.value];
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 p-4 border rounded-lg bg-white hover:bg-gray-50 transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon2, { className: `h-5 w-5 ${isMapped ? "text-green-600" : "text-gray-400"}` }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: field.label }),
                  field.required && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-xs", children: "Required" }),
                  isMapped && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-4 w-4 text-green-600" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500", children: field.description })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-64", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: mapping[field.value] || "none",
                onValueChange: (value) => handleMappingChange(field.value, value),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: isMapped ? "border-green-300 bg-green-50" : "", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select CSV column" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "none", children: "No mapping" }),
                    headers.filter((header) => header && header.trim() !== "").map((header) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: header, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-sm", children: header }) }, header))
                  ] })
                ]
              }
            ) })
          ] }, field.value);
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-medium text-blue-900", children: [
              mappedFields.length,
              " of ",
              vCardFields.length,
              " fields mapped"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-blue-700", children: hasRequiredMapping ? "Ready to generate QR codes" : "Please map at least the Name field to continue" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1", children: vCardFields.map((field) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: `w-3 h-3 rounded-full ${mapping[field.value] ? "bg-green-500" : "bg-gray-300"}`
            },
            field.value
          )) })
        ] })
      ] })
    ] }),
    preview.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Data Preview" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-600", children: "Sample of your CSV data" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "min-w-full divide-y divide-gray-200 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-gray-50", children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: headers.filter((header) => header && header.trim() !== "").slice(0, 5).map((header) => /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2 text-left font-medium text-gray-500", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono", children: header }) }, header)) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: preview.slice(0, 3).map((row, index) => /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: headers.filter((header) => header && header.trim() !== "").slice(0, 5).map((header) => {
          var _a, _b;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-2 text-gray-900", children: [
            (_a = row[header]) == null ? void 0 : _a.toString().substring(0, 30),
            ((_b = row[header]) == null ? void 0 : _b.toString().length) > 30 ? "..." : ""
          ] }, header);
        }) }, index)) })
      ] }) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button,
      {
        onClick: handleContinue,
        disabled: setMappingMutation.isPending || !hasRequiredMapping,
        className: "bg-blue-600 hover:bg-blue-700 text-white px-8",
        size: "lg",
        children: setMappingMutation.isPending ? "Processing..." : "Generate QR Codes"
      }
    ) })
  ] });
}
const Progress = reactExports.forwardRef(({ className, value, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Root,
  {
    ref,
    className: cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Indicator,
      {
        className: "h-full w-full flex-1 bg-primary transition-all",
        style: { transform: `translateX(-${100 - (value || 0)}%)` }
      }
    )
  }
));
Progress.displayName = Root.displayName;
function QRGeneration({ batchId, totalContacts, onGenerationComplete }) {
  const [isGenerating, setIsGenerating] = reactExports.useState(false);
  const [progress, setProgress] = reactExports.useState(0);
  const { toast: toast2 } = useToast();
  const { data: batchData } = useQuery({
    queryKey: [`/api/batches/${batchId}`],
    refetchInterval: isGenerating ? 1e3 : false
  });
  const generateMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", `/api/batches/${batchId}/generate`);
      return response.json();
    },
    onSuccess: (data) => {
      setIsGenerating(false);
      setProgress(100);
      toast2({
        title: "QR codes generated successfully",
        description: `Generated ${data.processedCount} QR codes`
      });
      queryClient.invalidateQueries({ queryKey: [`/api/batches/${batchId}`] });
      setTimeout(() => {
        onGenerationComplete();
      }, 1e3);
    },
    onError: (error) => {
      setIsGenerating(false);
      toast2({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "Failed to generate QR codes",
        variant: "destructive"
      });
    }
  });
  const handleGenerate = () => {
    setIsGenerating(true);
    setProgress(0);
    generateMutation.mutate();
  };
  reactExports.useEffect(() => {
    if (batchData) {
      const batch = batchData;
      if (batch.status === "generating" || batch.status === "completed") {
        const newProgress = Math.min(batch.processedContacts / totalContacts * 100, 100);
        setProgress(newProgress);
        if (batch.status === "completed") {
          setIsGenerating(false);
        }
      }
    }
  }, [batchData, totalContacts]);
  const getStatusInfo = () => {
    if (!batchData) return { icon: Clock, text: "Ready to generate", color: "text-gray-500" };
    const status = batchData.status;
    switch (status) {
      case "generating":
        return { icon: Clock, text: "Generating...", color: "text-yellow-500" };
      case "completed":
        return { icon: CircleCheckBig, text: "Completed", color: "text-green-500" };
      case "failed":
        return { icon: CircleAlert, text: "Failed", color: "text-red-500" };
      default:
        return { icon: Clock, text: "Ready to generate", color: "text-gray-500" };
    }
  };
  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-primary-custom", children: "Generate QR Codes" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-600", children: "Preview and generate vCard QR codes from your data" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-gray-500", children: [
          (batchData == null ? void 0 : batchData.processedContacts) || 0,
          " of ",
          totalContacts,
          " processed"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: handleGenerate,
            disabled: isGenerating || (batchData == null ? void 0 : batchData.status) === "completed",
            className: "bg-primary-custom hover:bg-primary/90",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "h-4 w-4 mr-2" }),
              isGenerating ? "Generating..." : "Generate All"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatusIcon, { className: `h-4 w-4 mr-2 ${statusInfo.color}` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-primary-custom", children: statusInfo.text })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-gray-500", children: [
          Math.round(progress),
          "%"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: progress, className: "w-full" })
    ] }),
    (batchData == null ? void 0 : batchData.contacts) && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "min-w-full divide-y divide-gray-200", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-gray-50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Email" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Phone" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Company" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "QR Code" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Status" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: batchData.contacts.slice(0, 10).map((contact) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-custom", children: contact.name || "N/A" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: contact.email || "N/A" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: contact.phone || "N/A" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: contact.company || "N/A" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: contact.qrCodeUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: contact.qrCodeUrl,
            alt: "QR Code",
            className: "w-12 h-12 border rounded"
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 bg-gray-200 rounded flex items-center justify-center", children: isGenerating ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-spin w-4 h-4 border-2 border-primary-custom border-t-transparent rounded-full" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-4 w-4 text-gray-400" }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: contact.qrCodeUrl ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-3 w-3 mr-1" }),
          "Generated"
        ] }) : isGenerating ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3 w-3 mr-1" }),
          "Processing"
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3 w-3 mr-1" }),
          "Pending"
        ] }) })
      ] }, contact.id)) })
    ] }) })
  ] }) });
}
function Skeleton({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: cn("animate-pulse rounded-md bg-muted", className),
      ...props
    }
  );
}
function QRPreviewGrid({ batchId, onReset }) {
  var _a;
  const { toast: toast2 } = useToast();
  const { data: batchData, isLoading } = useQuery({
    queryKey: [`/api/batches/${batchId}`]
  });
  const handleDownloadAll = async () => {
    try {
      const response = await fetch(`/api/batches/${batchId}/download`);
      if (!response.ok) {
        throw new Error("Download failed");
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `qr-codes-${batchId}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast2({
        title: "Download started",
        description: "Your QR codes are being downloaded as a ZIP file"
      });
    } catch (error) {
      toast2({
        title: "Download failed",
        description: "Failed to download QR codes",
        variant: "destructive"
      });
    }
  };
  const handleIndividualDownload = async (contactId, contactName) => {
    try {
      const response = await fetch(`/api/qr/${contactId}/download`);
      if (!response.ok) {
        throw new Error("Download failed");
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `qr-${contactName || contactId}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      toast2({
        title: "Download failed",
        description: "Failed to download QR code",
        variant: "destructive"
      });
    }
  };
  const handleShare = (contact) => {
    if (navigator.share) {
      navigator.share({
        title: `QR Code for ${contact.name}`,
        text: `vCard QR code for ${contact.name}`,
        url: contact.qrCodeUrl
      });
    } else {
      navigator.clipboard.writeText(contact.qrCodeUrl);
      toast2({
        title: "QR code URL copied",
        description: "The QR code URL has been copied to your clipboard"
      });
    }
  };
  const handlePreview = (contact) => {
    const newWindow = window.open("", "_blank");
    if (newWindow) {
      newWindow.document.write(`
        <html>
          <head><title>QR Code - ${contact.name}</title></head>
          <body style="display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #f5f5f5;">
            <div style="text-align: center; background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <h2 style="margin-bottom: 1rem; color: #333;">${contact.name}</h2>
              <div style="background: black; padding: 1rem; border-radius: 8px; display: inline-block;">
                <img src="${contact.qrCodeUrl}" alt="QR Code" style="max-width: 300px; height: auto; display: block;" />
              </div>
              <p style="margin-top: 1rem; color: #666;">${contact.company || ""}</p>
            </div>
          </body>
        </html>
      `);
    }
  };
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-48 mb-2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-64" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex space-x-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-32" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-24" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6", children: Array.from({ length: 12 }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-50 rounded-lg p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-20 h-20 mx-auto mb-3" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-full mb-1" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-2/3 mx-auto" })
      ] }, i)) })
    ] }) });
  }
  const contacts = ((_a = batchData == null ? void 0 : batchData.contacts) == null ? void 0 : _a.filter((contact) => contact.qrCodeUrl)) || [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-primary-custom", children: "Generated QR Codes" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-600", children: "Preview and download your vCard QR codes" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              onClick: onReset,
              variant: "outline",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "h-4 w-4 mr-2" }),
                "Start Over"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              onClick: handleDownloadAll,
              className: "bg-secondary-custom hover:bg-secondary/90",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4 mr-2" }),
                "Download All"
              ]
            }
          )
        ] })
      ] }),
      contacts.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-500", children: "No QR codes generated yet" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6", children: contacts.map((contact) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "bg-gray-50 rounded-lg p-4 text-center hover:shadow-md transition-shadow",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 mx-auto mb-3 bg-black rounded border p-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: contact.qrCodeUrl,
                alt: `QR Code for ${contact.name}`,
                className: "w-full h-full object-contain"
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-medium text-sm text-primary-custom truncate", children: contact.name || "Unnamed Contact" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500 truncate", children: contact.company || "" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center space-x-2 mt-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => handleIndividualDownload(contact.id, contact.name),
                  className: "text-primary-custom hover:text-primary/70 transition-colors",
                  title: "Download",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-3 w-3" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => handleShare(contact),
                  className: "text-primary-custom hover:text-primary/70 transition-colors",
                  title: "Share",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Share, { className: "h-3 w-3" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => handlePreview(contact),
                  className: "text-primary-custom hover:text-primary/70 transition-colors",
                  title: "Preview",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-3 w-3" })
                }
              )
            ] })
          ]
        },
        contact.id
      )) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-primary-custom mb-4", children: "Export Options" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-gray-200 rounded-lg p-4 hover:border-primary-custom hover:bg-primary/5 transition-colors cursor-pointer", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "text-primary-custom h-5 w-5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-semibold text-primary-custom mb-2", children: "Download ZIP" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-600 mb-4", children: "Download all QR codes as PNG images in a ZIP file" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: handleDownloadAll,
              className: "w-full bg-primary-custom hover:bg-primary/90",
              children: "Download ZIP"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-gray-200 rounded-lg p-4 hover:border-secondary-custom hover:bg-secondary/5 transition-colors cursor-pointer", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Share, { className: "text-secondary-custom h-5 w-5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-semibold text-primary-custom mb-2", children: "Get URLs" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-600 mb-4", children: "Generate shareable URLs for each QR code" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: () => {
                const urls = contacts.map((c) => `${c.name}: ${c.qrCodeUrl}`).join("\n");
                navigator.clipboard.writeText(urls);
                toast2({
                  title: "URLs copied",
                  description: "All QR code URLs have been copied to clipboard"
                });
              },
              className: "w-full bg-secondary-custom hover:bg-secondary/90",
              children: "Generate URLs"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-gray-200 rounded-lg p-4 hover:border-accent-custom hover:bg-accent/5 transition-colors cursor-pointer", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "text-accent-custom h-5 w-5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-semibold text-primary-custom mb-2", children: "Export CSV" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-600 mb-4", children: "Export contact data with QR code URLs in CSV format" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: () => {
                toast2({
                  title: "CSV export",
                  description: "CSV export functionality would be implemented here"
                });
              },
              className: "w-full bg-accent-custom hover:bg-accent/90",
              children: "Export CSV"
            }
          )
        ] })
      ] })
    ] }) })
  ] });
}
const steps = [
  { id: "upload", label: "Upload File", number: 1 },
  { id: "mapping", label: "Map Fields", number: 2 },
  { id: "generation", label: "Generate QR Codes", number: 3 },
  { id: "preview", label: "Download", number: 4 }
];
function StepProgress({ currentStep }) {
  const getCurrentStepIndex = () => {
    return steps.findIndex((step) => step.id === currentStep);
  };
  const currentStepIndex = getCurrentStepIndex();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center space-x-4", children: steps.map((step, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${index <= currentStepIndex ? "bg-primary-custom text-white" : "bg-gray-300 text-gray-500"}`, children: index < currentStepIndex ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-4 w-4" }) : step.number }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `ml-2 text-sm font-medium ${index <= currentStepIndex ? "text-primary-custom" : "text-gray-500"}`, children: step.label })
    ] }),
    index < steps.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-8 h-px ml-4 ${index < currentStepIndex ? "bg-primary-custom" : "bg-gray-300"}` })
  ] }, step.id)) }) }) });
}
function Home() {
  const [currentStep, setCurrentStep] = reactExports.useState("upload");
  const [uploadResult, setUploadResult] = reactExports.useState(null);
  const [, setFieldMapping] = reactExports.useState({});
  const handleUploadComplete = (result) => {
    setUploadResult(result);
    setCurrentStep("mapping");
  };
  const handleMappingComplete = (mapping) => {
    setFieldMapping(mapping);
    setCurrentStep("generation");
  };
  const handleGenerationComplete = () => {
    setCurrentStep("preview");
  };
  const resetProcess = () => {
    setCurrentStep("upload");
    setUploadResult(null);
    setFieldMapping({});
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background-light", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "bg-white shadow-sm border-b border-gray-200", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center h-16", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 bg-primary-custom rounded-lg flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(QrCode, { className: "text-white", size: 16 }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold text-primary-custom", children: "QR Bulk Generator" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500", children: "vCard QR Codes from CSV/Excel" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleHelp, { className: "h-4 w-4" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "bg-primary-custom hover:bg-primary/90", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-4 w-4 mr-2" }),
          "Sign In"
        ] })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StepProgress, { currentStep }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8", children: [
        currentStep === "upload" && /* @__PURE__ */ jsxRuntimeExports.jsx(FileUpload, { onUploadComplete: handleUploadComplete }),
        currentStep === "mapping" && uploadResult && /* @__PURE__ */ jsxRuntimeExports.jsx(
          FieldMapping,
          {
            headers: uploadResult.headers,
            preview: uploadResult.preview,
            onMappingComplete: handleMappingComplete,
            batchId: uploadResult.batchId
          }
        ),
        currentStep === "generation" && uploadResult && /* @__PURE__ */ jsxRuntimeExports.jsx(
          QRGeneration,
          {
            batchId: uploadResult.batchId,
            totalContacts: uploadResult.totalContacts,
            onGenerationComplete: handleGenerationComplete
          }
        ),
        currentStep === "preview" && uploadResult && /* @__PURE__ */ jsxRuntimeExports.jsx(
          QRPreviewGrid,
          {
            batchId: uploadResult.batchId,
            onReset: resetProcess
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "bg-white border-t border-gray-200 mt-16", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500", children: "© 2024 QR Bulk Generator. All rights reserved." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#", className: "text-sm text-gray-500 hover:text-primary-custom", children: "Privacy Policy" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#", className: "text-sm text-gray-500 hover:text-primary-custom", children: "Terms of Service" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center space-x-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "#", className: "text-gray-400 hover:text-primary-custom", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: "Twitter" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "h-5 w-5", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fillRule: "evenodd", d: "M20 4.077a8.04 8.04 0 01-2.31.632 4.014 4.014 0 001.762-2.218 8.064 8.064 0 01-2.551.975A4.008 4.008 0 0013.846 2c-2.21 0-4 1.79-4 4 0 .314.036.62.105.916-3.325-.167-6.275-1.76-8.25-4.18a3.99 3.99 0 00-.541 2.01c0 1.386.705 2.608 1.777 3.32a3.96 3.96 0 01-1.81-.5v.05c0 1.937 1.378 3.549 3.204 3.916a4.006 4.006 0 01-1.804.069c.509 1.588 1.982 2.744 3.73 2.776A8.054 8.054 0 012 16.696a11.37 11.37 0 006.17 1.808c7.404 0 11.448-6.135 11.448-11.454 0-.174-.004-.347-.012-.52A8.18 8.18 0 0020 4.077z", clipRule: "evenodd" }) })
      ] }) })
    ] }) }) })
  ] });
}
function generateVCard(contact) {
  const lines = ["BEGIN:VCARD", "VERSION:2.1"];
  if (contact.name) {
    const cleanFullName = contact.name.trim().replace(/[;,\\]/g, " ").trim();
    lines.push(`N:;${cleanFullName};;;`);
    lines.push(`FN:${cleanFullName}`);
    lines.push(`X-ANDROID-CUSTOM:vnd.android.cursor.item/name;${cleanFullName};1;;;;;;;;;;;;;`);
  }
  if (contact.email) {
    lines.push(`EMAIL;INTERNET:${contact.email}`);
  }
  if (contact.phone) {
    const formattedPhone = contact.phone.startsWith("0") ? contact.phone : `0${contact.phone}`;
    lines.push(`TEL;CELL:${formattedPhone}`);
  }
  if (contact.phone2) {
    const formattedPhone2 = contact.phone2.startsWith("0") ? contact.phone2 : `0${contact.phone2}`;
    lines.push(`TEL;WORK:${formattedPhone2}`);
  }
  if (contact.company) {
    const company = contact.company.replace(/[;,\\]/g, " ").trim();
    lines.push(`ORG:${company}`);
  }
  if (contact.position) {
    const position = contact.position.replace(/[;,\\]/g, " ").trim();
    lines.push(`TITLE:${position}`);
  }
  if (contact.website) {
    lines.push(`URL:${contact.website}`);
  }
  lines.push("END:VCARD");
  return lines.join("\r\n");
}
function ContactPage() {
  const [match, params] = useRoute("/contact/:contactId");
  const [contact, setContact] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState(null);
  const { toast: toast2 } = useToast();
  reactExports.useEffect(() => {
    if (!match || !(params == null ? void 0 : params.contactId)) return;
    const fetchContact = async () => {
      try {
        const response = await fetch(`/api/contacts/${params.contactId}`);
        if (!response.ok) {
          throw new Error("Contact not found");
        }
        const data = await response.json();
        setContact(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load contact");
      } finally {
        setLoading(false);
      }
    };
    fetchContact();
  }, [match, params == null ? void 0 : params.contactId]);
  const handleSaveToContacts = () => {
    if (!contact) return;
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS) {
      window.location.href = `/api/contacts/${contact.id}/vcard`;
      toast2({
        title: "Downloading contact",
        description: "The contact file will be downloaded. Tap to open it and add to your contacts."
      });
    } else {
      const vCardData = generateVCard({
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        phone2: contact.phone2,
        company: contact.company,
        position: contact.position,
        website: contact.website
      });
      const blob = new Blob([vCardData], { type: "text/vcard" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${contact.name || "contact"}.vcf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast2({
        title: "Contact saved",
        description: "Contact has been downloaded to your device"
      });
    }
  };
  const formatPhoneNumber = (phone) => {
    return phone.startsWith("0") ? phone : `0${phone}`;
  };
  const handleCall = (phone) => {
    const formattedPhone = formatPhoneNumber(phone);
    window.location.href = `tel:${formattedPhone}`;
  };
  const handleEmail = (email) => {
    window.location.href = `mailto:${email}`;
  };
  const handleWebsite = (website) => {
    const url = website.startsWith("http") ? website : `https://${website}`;
    window.open(url, "_blank");
  };
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-gradient-to-br from-[#CBD9E9] to-[#104E83] p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-md mx-auto pt-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-24 h-24 rounded-full mx-auto" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-32 mx-auto" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-24 mx-auto" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-40 mx-auto" })
    ] }) }) }) }) });
  }
  if (error || !contact) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-gradient-to-br from-[#CBD9E9] to-[#104E83] p-4 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "max-w-md w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-6 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 bg-[#BC412D]/20 rounded-full flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-8 w-8 text-[#BC412D]" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold text-gray-900 mb-2", children: "Contact Not Found" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-600 mb-4", children: "The contact you're looking for doesn't exist or has been removed." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => window.location.href = "/", variant: "outline", className: "border-[#1E3460] text-[#1E3460] hover:bg-[#1E3460] hover:text-white", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4 mr-2" }),
        "Go Back"
      ] })
    ] }) }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-white", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative bg-gradient-to-br from-[#1E3460] via-[#104E83] to-[#BC412D] text-white overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-black/10" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full -translate-x-36 -translate-y-36" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-0 right-0 w-96 h-96 bg-[#D35D30]/20 rounded-full translate-x-48 translate-y-48" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative max-w-md mx-auto text-center px-6 py-12", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-28 h-28 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg ring-4 ring-white/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-14 w-14 text-white" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold mb-2 text-white drop-shadow-sm", children: contact.name }),
        contact.position && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/95 text-lg font-medium mb-1", children: contact.position })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md mx-auto px-4 -mt-8 relative z-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "shadow-2xl border-0 bg-white/95 backdrop-blur-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 pb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            contact.phone && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                onClick: () => handleCall(contact.phone),
                className: "bg-gradient-to-r from-[#1E3460] to-[#104E83] hover:from-[#104E83] hover:to-[#1E3460] text-white h-16 flex flex-col gap-2 shadow-lg transform hover:scale-105 transition-all duration-200",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-5 w-5" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", children: "Call" })
                ]
              }
            ),
            contact.website && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                onClick: () => handleWebsite(contact.website),
                className: "bg-gradient-to-r from-[#BC412D] to-[#D35D30] hover:from-[#D35D30] hover:to-[#BC412D] text-white h-16 flex flex-col gap-2 shadow-lg transform hover:scale-105 transition-all duration-200",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "h-5 w-5" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", children: "Website" })
                ]
              }
            )
          ] }),
          contact.phone2 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              onClick: () => handleCall(contact.phone2),
              className: "w-full bg-gradient-to-r from-[#BC412D] to-[#1E3460] hover:from-[#1E3460] hover:to-[#BC412D] text-white h-12 flex items-center justify-center gap-2 shadow-lg transform hover:scale-105 transition-all duration-200",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-4 w-4" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", children: "Call Secondary" })
              ]
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-6 pb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          contact.phone && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-4 p-4 rounded-xl hover:bg-[#CBD9E9]/30 transition-colors group cursor-pointer", onClick: () => handleCall(contact.phone), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 bg-[#1E3460]/10 rounded-lg flex items-center justify-center group-hover:bg-[#1E3460]/20 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-5 w-5 text-[#1E3460]" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-medium text-gray-500 uppercase tracking-wide", children: [
                "Phone ",
                contact.phone2 ? "(Primary)" : ""
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-semibold text-gray-900", children: formatPhoneNumber(contact.phone) })
            ] })
          ] }),
          contact.phone2 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-4 p-4 rounded-xl hover:bg-[#CBD9E9]/30 transition-colors group cursor-pointer", onClick: () => handleCall(contact.phone2), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 bg-[#D35D30]/10 rounded-lg flex items-center justify-center group-hover:bg-[#D35D30]/20 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-5 w-5 text-[#D35D30]" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-gray-500 uppercase tracking-wide", children: "Phone (Secondary)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-semibold text-gray-900", children: formatPhoneNumber(contact.phone2) })
            ] })
          ] }),
          contact.email && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center space-x-4 p-4 rounded-xl hover:bg-[#CBD9E9]/30 transition-colors group cursor-pointer",
              onClick: () => handleEmail(contact.email),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 bg-[#104E83]/10 rounded-lg flex items-center justify-center group-hover:bg-[#104E83]/20 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-5 w-5 text-[#104E83]" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-gray-500 uppercase tracking-wide", children: "Email" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-semibold text-gray-900 break-all", children: contact.email })
                ] })
              ]
            }
          ),
          contact.company && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-4 p-4 rounded-xl hover:bg-[#CBD9E9]/30 transition-colors group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 bg-[#BC412D]/10 rounded-lg flex items-center justify-center group-hover:bg-[#BC412D]/20 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Building, { className: "h-5 w-5 text-[#BC412D]" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-gray-500 uppercase tracking-wide", children: "Company" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-semibold text-gray-900", children: contact.company })
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 pt-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              onClick: handleSaveToContacts,
              className: "w-full bg-gradient-to-r from-[#BC412D] to-[#1E3460] hover:from-[#1E3460] hover:to-[#BC412D] text-white h-14 shadow-lg transform hover:scale-105 transition-all duration-200 font-semibold text-lg",
              size: "lg",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-6 w-6 mr-3" }),
                "Save to Contacts"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "a",
            {
              href: `/api/contacts/${contact.id}/vcard`,
              className: "text-sm text-[#1E3460] hover:text-[#104E83] underline",
              download: `${contact.name || "contact"}.vcf`,
              children: "Direct vCard Download"
            }
          ) })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          onClick: () => window.location.href = "/",
          variant: "ghost",
          className: "text-[#1E3460] hover:text-[#104E83] hover:bg-[#CBD9E9]/30 font-medium transition-all duration-200",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4 mr-2" }),
            "Back to QR Generator"
          ]
        }
      ) })
    ] })
  ] });
}
function NotFound() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen w-full flex items-center justify-center bg-gray-50", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "w-full max-w-md mx-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "pt-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex mb-4 gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-8 w-8 text-red-500" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "404 Page Not Found" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-sm text-gray-600", children: "Did you forget to add the page to the router?" })
  ] }) }) });
}
function Router() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Switch, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/", component: Home }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/contact/:contactId", component: ContactPage }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { component: NotFound })
  ] });
}
function App() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TooltipProvider, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Router, {})
  ] }) });
}
createRoot(document.getElementById("root")).render(/* @__PURE__ */ jsxRuntimeExports.jsx(App, {}));
