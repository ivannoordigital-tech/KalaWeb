/**
 * Shim tipe untuk modul automation yang hanya ada di monorepo (bukan di image
 * Docker CMS). Saat build Docker, folder `automation/dist` tidak disalin,
 * sehingga TypeScript tidak boleh gagal hanya karena modul tersebut.
 */
declare module '*automation/dist/services/toolService.js' {
  export const toolService: any
}

declare module '*automation/dist/utilities/markdownToLexical.js' {
  export const convertMarkdownToLexical: any
}
