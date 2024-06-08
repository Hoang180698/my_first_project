package com.example.snwbackend.service;

import com.example.snwbackend.entity.User;
import com.example.snwbackend.exception.BadRequestException;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.core.io.support.ResourceRegion;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
@Slf4j
public class VideoService {
    private static final String uploadDir = "video_uploads";
    public static final long CHUNK_SIZE = 100000L;

    private final HttpSession session;

    private void createFolder(String path) {
        File file = new File(path);
        if (!file.exists()) {
            file.mkdirs();
        }
    }


    public VideoService(HttpSession session) {
        this.session = session;
        createDirectory(uploadDir);
    }

    public void createDirectory(String name) {
        Path path = Paths.get(name);
        if (!Files.exists(path)) {
            try {
                Files.createDirectory(path);
            } catch (IOException e) {
                log.error("Cannot create directory: " + path);
                log.error(e.getMessage());
                throw new RuntimeException("Cannot create directory: " + path);
            }
        }
    }

    public String uploadVideo(User user, MultipartFile file) {
        double fileSize =  (double) (file.getSize() / 1_048_576);
        if(fileSize > 30) {
            throw new BadRequestException("file must not exceed 30MB");
        }
        // Upload file vào folder
        String videoId = UUID.randomUUID().toString();
        Path rootPath = Paths.get(uploadDir);
        Path userPath = rootPath.resolve(user.getId().toString());
        createFolder(userPath.toString());
        Path filePath = userPath.resolve(videoId);
        try {
            Files.copy(file.getInputStream(), filePath);
            return "/api/videos/" + user.getId() + "/" + videoId;
        } catch (IOException e) {
            log.error("Cannot upload file: " + filePath);
            log.error(e.getMessage());
            throw new RuntimeException("Cannot upload file: " + filePath);
        }

    }

    public ResourceRegion getVideoResourceRegion(String fileName, long start, long end, Integer userId) throws IOException {
        UrlResource videoResource = new UrlResource("file:" + uploadDir +"/" + userId + "/" + File.separator + fileName);

        if (!videoResource.exists() || !videoResource.isReadable()) {
            throw new IOException("Video not found");
        }

        Resource video = videoResource;
        long contentLength = video.contentLength();
        end = Math.min(end, contentLength - 1);

        long rangeLength = Math.min(CHUNK_SIZE, end - start + 1);
        return new ResourceRegion(video, start, rangeLength);
    }

    public void deleteVideo(String userId, String videoId) {
        Path path = Paths.get(uploadDir).resolve(userId).resolve(videoId);
        try {
            Files.deleteIfExists(path);
        } catch (IOException e) {
            log.error("Cannot delete file: " + path);
            log.error(e.getMessage());
            throw new RuntimeException(e.getMessage());
        }
    }
}
