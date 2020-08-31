declare module 'pure-color/convert/lch2lab' {
  const lch2lab: (lch: readonly [number, number, number]) => [number, number, number]
  export = lch2lab
}

declare module 'pure-color/convert/lab2xyz' {
  const lab2xyz: (lab: readonly [number, number, number]) => [number, number, number]
  export = lab2xyz
}

declare module 'pure-color/convert/lab2lch' {
  const lab2lch: (lab: readonly [number, number, number]) => [number, number, number]
  export = lab2lch
}

declare module 'pure-color/convert/xyz2lab' {
  const xyz2lab: (xyz: readonly [number, number, number]) => [number, number, number]
  export = xyz2lab
}

declare module 'pure-color/convert/rgb2xyz' {
  const rgb2xyz: (rgb: readonly [number, number, number]) => [number, number, number]
  export = rgb2xyz
}
