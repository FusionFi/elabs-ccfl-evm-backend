export function mapFiat(obj: any) {
  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      delete obj[i]['createdAt'];
      delete obj[i]['updatedAt'];
    }
  } else {
    delete obj['createdAt'];
    delete obj['updatedAt'];
  }

  return obj;
}
