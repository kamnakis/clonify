/* eslint-disable camelcase */
export interface Song {
  [key: string]: any
  id: number
  title: string
  artist: {
    [key: string]: any
    first_name: string
    last_name: string
  }
  file: {
    [key: string]: any
    url: string
  }
}
