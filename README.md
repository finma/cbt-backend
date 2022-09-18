# CBT Backend V. 1.0.0

## Requirements

| Package | Version |
| ------- | :-----: |
| NodeJS  | 16.13.1 |

## How to start

- Install NodeJS
- Clone cbt-be repository
- cd cbt-be
- run command `npm install`
- run command `npm run start`

## API

| URL                                              |                Use for                |
| ------------------------------------------------ | :-----------------------------------: |
| https://localhost:3001/api/auth/signup           |         melakukan user signup         |
| https://localhost:3001/api/auth/signin           |         melakukan user signin         |
| https://localhost:3001/api/berita                |         melihat semua berita          |
| https://localhost:3001/api/berita?isActive=true  |    melihat semua berita yang aktif    |
| https://localhost:3001/api/berita?isActive=false | melihat semua berita yang tidak aktif |
| https://localhost:3001/api/berita/create         |          membuat berita baru          |
| https://localhost:3001/api/berita/delete/:id     |           menghapus berita            |
| https://localhost:3001/api/berita/update/:id     |           mengupdate berita           |
| https://localhost:3001/api/soal                  |          melihat semua soal           |
| https://localhost:3001/api/soal/create           |           membuat soal baru           |
| https://localhost:3001/api/soal/delete/:id       |            menghapus soal             |
| https://localhost:3001/api/soal/update/:id       |            mengupdate soal            |
