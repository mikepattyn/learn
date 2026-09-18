import { useEffect } from "react";
import { applyPrefsToDocument, usePrefs } from "@/lib/prefs";

export function PrefsSync() {
  const theme = usePrefs((s) => s.theme);
  const typeSize = usePrefs((s) => s.typeSize);
  const motion = usePrefs((s) => s.motion);

  useEffect(() => {
    applyPrefsToDocument({ theme, typeSize, motion });
  }, [theme, typeSize, motion]);

  return null;
}
