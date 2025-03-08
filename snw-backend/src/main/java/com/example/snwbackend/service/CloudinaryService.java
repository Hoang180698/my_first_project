package com.example.snwbackend.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.snwbackend.exception.BadRequestException;
import com.example.snwbackend.response.AudioUploadResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.Map;

@Service
@Slf4j
public class CloudinaryService {
    @Autowired
    private Cloudinary cloudinary;

    public String uploadVideo(MultipartFile file, String tag) throws IOException {
        double fileSize =  (double) (file.getSize() / 1_048_576);
        if(fileSize > 99) {
            throw new BadRequestException("video must not exceed 99MB");
        }

        var result = cloudinary.uploader().upload(file.getBytes(),
                ObjectUtils.asMap(
                        "resource_type", "video",
                        "asset_folder", "Hoagram",
                        "tags", tag
                ));
        log.info(result.toString());
        return result.get("url").toString();
    }

    public void deleteVideo(String tag) {
        try {
            cloudinary.api().deleteResourcesByTag(tag, ObjectUtils.asMap("resource_type", "video"));
;        } catch (Exception e) {
            log.error(e.getMessage());
            throw new RuntimeException(e.getMessage());
        }
    }

    public AudioUploadResponse uploadAudio(String base64, String conversationId) {
        byte[] data = Base64.getDecoder().decode(base64);

        try {
            var result = cloudinary.uploader().upload(data,  ObjectUtils.asMap(
                    "resource_type", "auto",
                    "asset_folder", conversationId
            ));

            log.info(result.toString());

             return new AudioUploadResponse(result.get("url").toString(), Double.parseDouble(result.get("duration").toString()));
        } catch (IOException e) {
            throw new RuntimeException(e.getMessage());
        }
    }
}
