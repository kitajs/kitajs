/** Remove extension from import path */
export function removeExt(imp: string) {
  return imp.replace(/\.[^/.]+$/, '');
}
