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
