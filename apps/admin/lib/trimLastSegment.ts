export const trimLastSegment = (pathname: string) => {
  const index = pathname.lastIndexOf("/");
  return index > pathname.indexOf("//") + 1 ? pathname.substring(0, index) : pathname;
};
