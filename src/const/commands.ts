import { BotCommand } from "grammy/types"

type BotCommandWithExample = BotCommand & {
    example: string
}

export const commandList: BotCommandWithExample[] = [
    { 
        command: "nik2", 
        description: "Pencarian data NOMOR INDUK KEPENDUDUKAN" ,
        example: "/nik2 23423434233434"
    },
    { 
        command: "trcnik2", 
        description: "Pencarian data NOMOR HP berdasarkan NIK " ,
        example: "/trcnik2 23423434233434"
    },
    { 
        command: "regid2", 
        description: "Pencarian data NIK berdasarkan REGISTRASI NOMOR HP" ,
        example: "/regid2 0893978342349"
    },
    { 
        command: "prof", 
        description: "Pencarian data NOMOR HP" ,
        example: "/prof 084328347384"
    },
    { 
        command: "email", 
        description: "Pencarian data EMAIL berdasarkan MEDIA SOSIAL" ,
        example: "/email email@contoh.com"
    },
    { 
        command: "nopol", 
        description: "Pencarian data NOMOR POLISI KENDARAAN" ,
        example: "/nopol XX 23123 AA"
    },
    { 
        command: "noka", 
        description: "Pencarian data NOMOR RANGKA KENDARAAN" ,
        example: "/noka 232-32049203"
    },
    { 
        command: "nosin", 
        description: "Pencarian data NOMOR MESIN KENDARAAN" ,
        example: "/nosin 32409-43240"
    },
    { 
        command: "pln", 
        description: "Pencarian data TOKEN PLN PRABAYAR" ,
        example: "/pln 304594050"
    },
    { 
        command: "rek", 
        description: "Pencarian data NOMOR REKENING BANK" ,
        example: "/rek 23434324"
    },
    { 
        command: "nkk", 
        description: "Pencarian data KARTU KELUARGA" ,
        example: "/nkk 230894859402349"
    },
    { 
        command: "nama2", 
        description: "Pencarian data NAMA " ,
        example: "/nama2 Budi"
    },
    { 
        command: "traceimei", 
        description: "Pencarian IMEI berdasarkan DB AKUN MC yang didaftarkan" ,
        example: "/traceimei 349283049234934"
    },
    { 
        command: "track", 
        description: "Pencarian lokasi berdasarkan NOMOR HP" ,
        example: "/track 0823948948"
    },
    { 
        command: "fr", 
        description: "FACE RECOGNITION. Pencarian NIK berdasarkan PENGENALAN WAJAH (foto)" ,
        example: "/fr"
    },
    { 
        command: "cp", 
        description: "(pencarian lokasi khusus provdr tsel)" ,
        example: "/cp 085322204349"
    },
    { 
        command: "nikag", 
        description: "(pncrian data kesehatan)" ,
        example: "/nikag 0938492394"
    },
    { 
        command: "nama", 
        description: "Pencarian data berdasarkan nama" ,
        example: "/nama Budi"
    },
    { 
        command: "nik", 
        description: "Pencarian data berdasarkan NIK" ,
        example: "/nik 2439480239498"
    },
    { 
        command: "kk", 
        description: "Pencarian data berdasarkan KK" ,
        example: "/kk 2349834938"
    },
    {
        command: "help",
        description: "Menampilkan list Command yang tersedia",
        example: "/help"
    }
]
