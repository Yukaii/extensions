export type Application = {
  version: string;
  prereleaseVersion: string | null;
  buildVersion: string;
  execPath: string;
  platform: string;
};

export type ColorPalette = {
  color: [number, number, number];
  ratio: number;
};

export type Item = {
  id: string;
  name: string;
  size: number;
  btime: number;
  mtime: number;
  ext: string;
  tags: string[];
  folders: string[];
  url: string;
  annotation: string;
  modificationTime: number;
  width: number;
  height: number;
  text?: string;
  noThumbnail: boolean;
  lastModified: number;
  palettes?: ColorPalette[];
} & (
  | {
      isDeleted: true;
      deletedTime: number;
    }
  | {
      isDeleted: false;
    }
);

// {
//   id: 'LCSI6YTUF2BJ1',
//   name: 'Beautiful Free Images  Pictures  Unsplash',
//   size: 669397,
//   btime: 1673492445169,
//   mtime: 1673492445170,
//   ext: 'jpg',
//   tags: [],
//   folders: [ 'LCRW56AGOWG3P' ],
//   isDeleted: false,
//   url: 'https://unsplash.com/t/arts-culture',
//   annotation: '',
//   modificationTime: 1673492445138,
//   width: 3198,
//   height: 1188,
//   palettes: [
//     { color: [Array], ratio: 37, '$$hashKey': 'object:1093' },
//     { color: [Array], ratio: 11, '$$hashKey': 'object:1094' },
//     { color: [Array], ratio: 11, '$$hashKey': 'object:1095' },
//     { color: [Array], ratio: 11, '$$hashKey': 'object:1096' },
//     { color: [Array], ratio: 10, '$$hashKey': 'object:1097' },
//     { color: [Array], ratio: 8, '$$hashKey': 'object:1098' },
//     { color: [Array], ratio: 4.03, '$$hashKey': 'object:1099' },
//     { color: [Array], ratio: 3.36, '$$hashKey': 'object:1100' },
//     { color: [Array], ratio: 1.4, '$$hashKey': 'object:1101' }
//   ]
// }

// {
//   id: 'LCRW5GSKYE2FL',
//   name: '無題',
//   size: 0,
//   btime: 1673455423559,
//   mtime: 1673455423559,
//   ext: 'txt',
//   tags: [],
//   folders: [ 'LCRW56AGOWG3P' ],
//   isDeleted: true,
//   url: '',
//   annotation: '',
//   modificationTime: 1673455423558,
//   text: '',
//   deletedTime: 1673455445698
// }

export type Folder = {
  id: string;
  name: string;
  description: string;
  children: (Folder & {
    parent: string;
  })[];
  modificationTime: number;
  tags: string[];
  imageCount: number;
  descendantImageCount: number;
  pinyin: string;
  extendTags: string[];
};

export type EagleAPIResponse<T> = {
  status: "success";
  data: T;
};
