declare module 'pure-color/convert/lch2lab' {
  const lch2lab: (lch: ArrayLike<number>) => [number, number, number]
  export = lch2lab
}

declare module 'pure-color/convert/lab2xyz' {
  const lab2xyz: (lab: ArrayLike<number>) => [number, number, number]
  export = lab2xyz
}

declare module 'pure-color/convert/xyz2rgb' {
  const xyz2rgb: (lch: ArrayLike<number>) => [number, number, number]
  export = xyz2rgb
}

declare module 'pure-color/convert/lab2lch' {
  const lab2lch: (lch: ArrayLike<number>) => [number, number, number]
  export = lab2lch
}

declare module 'pure-color/convert/xyz2lab' {
  const xyz2lab: (lab: ArrayLike<number>) => [number, number, number]
  export = xyz2lab
}

declare module 'pure-color/convert/rgb2xyz' {
  const rgb2xyz: (lch: ArrayLike<number>) => [number, number, number]
  export = rgb2xyz
}
