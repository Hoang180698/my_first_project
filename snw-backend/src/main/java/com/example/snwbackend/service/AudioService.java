package com.example.snwbackend.service;

import com.example.snwbackend.entity.User;
import com.example.snwbackend.exception.BadRequestException;
import com.example.snwbackend.response.AudioUploadResponse;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.apache.tomcat.util.http.fileupload.FileUtils;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.core.io.support.ResourceRegion;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import jakarta.servlet.http.HttpSession;

import javax.sound.sampled.AudioFormat;
import javax.sound.sampled.AudioInputStream;
import javax.sound.sampled.AudioSystem;
import javax.sound.sampled.UnsupportedAudioFileException;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;
import java.util.UUID;

@Service
@Slf4j
public class AudioService {
    private static final String uploadDir = "video_uploads";
    public static final long CHUNK_SIZE = 100000L;

    private final HttpSession session;

    private void createFolder(String path) {
        File file = new File(path);
        if (!file.exists()) {
            file.mkdirs();
        }
    }


    public AudioService(HttpSession session) {
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

    public AudioUploadResponse uploadAudio(String conversationId, String base64) {

        // Upload file vào folder
        String audioId = UUID.randomUUID().toString();
        Path rootPath = Paths.get(uploadDir);
        Path conversationPath = rootPath.resolve(conversationId);
        createFolder(conversationPath.toString());
        Path filePath = conversationPath.resolve(audioId);

        File targetFile = filePath.toFile();
        try (FileOutputStream fos = new FileOutputStream(targetFile)) {
            byte[] data = Base64.getDecoder().decode(base64);
            fos.write(data);

            AudioInputStream audioInputStream = AudioSystem.getAudioInputStream(targetFile);
            AudioFormat format = audioInputStream.getFormat();
            long frames = audioInputStream.getFrameLength();
            double durationInSeconds = (frames+0.0) / format.getFrameRate();
            String audioUrl = "/api/audio/" + conversationId + "/" + audioId;

            return new AudioUploadResponse(audioUrl, durationInSeconds);

        } catch (IOException | UnsupportedAudioFileException e) {
            log.error("Cannot upload file: " + filePath);
            log.error(e.getMessage());
            throw new RuntimeException("Cannot upload file: " + filePath);
        }

    }

    public ResourceRegion getAudioResourceRegion(String fileName, long start, long end, Integer conversationId) throws IOException {
        UrlResource videoResource = new UrlResource("file:" + uploadDir +"/" + conversationId + "/" + File.separator + fileName);

        if (!videoResource.exists() || !videoResource.isReadable()) {
            throw new IOException("Video not found");
        }

        Resource video = videoResource;
        long contentLength = video.contentLength();
        end = Math.min(end, contentLength - 1);

        long rangeLength = Math.min(CHUNK_SIZE, end - start + 1);
        return new ResourceRegion(video, start, rangeLength);
    }

    public void deleteAudio(String userId, String audioId) {
        Path path = Paths.get(uploadDir).resolve(userId).resolve(audioId);
        try {
            Files.deleteIfExists(path);
        } catch (IOException e) {
            log.error("Cannot delete file: " + path);
            log.error(e.getMessage());
            throw new RuntimeException(e.getMessage());
        }
    }
}
