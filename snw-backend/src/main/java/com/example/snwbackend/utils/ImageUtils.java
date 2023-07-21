package com.example.snwbackend.utils;

import com.example.snwbackend.exception.BadRequestException;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Component
public class ImageUtils {
    public void validateFile( MultipartFile file) {
        // Kiểm tra tên file
        String fileName = file.getOriginalFilename();
        if(fileName == null || fileName.isEmpty()) {
            throw new BadRequestException("file could not be empty");
        }

        // image.png -> png
        // avatar.jpg -> jpg
        // Kiểm tra đuôi file (jpg, png, jpeg)
        String fileExtension = getFileExtension(fileName);
        if(!checkFileExtension(fileExtension)) {
            throw new BadRequestException("This file is not in the correct format");
        }

        // Kiểm tra dung lượng file (<= 3MB)
        double fileSize =  (double) (file.getSize() / 1_048_576);
        if( fileSize > 3) {
            throw new BadRequestException("file must not exceed 3MB");
        }
    }

    // Lấy extension của file (ví dụ png, jpg, ...)
    public String getFileExtension(String fileName) {
        int lastIndexOf = fileName.lastIndexOf(".");
        return fileName.substring(lastIndexOf + 1);
    }

    // Kiểm tra extension của file có được phép hay không
    public boolean checkFileExtension(String fileExtension) {
        List<String> extensions = new ArrayList<>(List.of("png", "jpg", "jpeg", "gif"));
        return extensions.contains(fileExtension.toLowerCase());
    }
}
