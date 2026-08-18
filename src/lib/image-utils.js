/**
 * Utility function to extract a valid, non-empty image URL from a product object.
 * Supports various array and single-property naming conventions used in Firestore & catalog data.
 */
export function getProductImage(product, fallback = "/images/medical-analyzer-default.png") {
  if (!product) return fallback;

  // 1. Check array properties
  const arrayProps = [product.images, product.gallery, product.imgList];
  for (const arr of arrayProps) {
    if (Array.isArray(arr) && arr.length > 0) {
      for (const item of arr) {
        if (typeof item === "string" && item.trim() !== "") {
          return item.trim();
        }
        if (item && typeof item === "object") {
          const url = item.url || item.src || item.path;
          if (typeof url === "string" && url.trim() !== "") {
            return url.trim();
          }
        }
      }
    }
  }

  // 2. Check single property fields
  const candidates = [
    product.image,
    product.img,
    product.imageUrl,
    product.productImage,
    product.photo,
    product.picture,
    product.src,
    product.thumbnail,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim() !== "") {
      return candidate.trim();
    }
  }

  return fallback;
}
