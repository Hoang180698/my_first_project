package com.example.snwbackend.controller;

import com.example.snwbackend.service.AudioService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.support.ResourceRegion;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@Tag(name = "Audio", description = "Audio management APIs")
@RestController
@RequestMapping("api/audio")
@SecurityRequirement(name = "bearerAuth")
public class AudioController {

    @Autowired
    private AudioService audioService;

    @GetMapping(value = "{conversationId}/{fileName}", produces = "application/octet-stream")
    public ResponseEntity<ResourceRegion> streamVideo(@PathVariable Integer conversationId, @PathVariable String fileName, HttpServletRequest request) throws IOException {
        long rangeStart = 0;
        long rangeEnd = Long.MAX_VALUE;

        String rangeHeader = request.getHeader("Range");
        if (rangeHeader != null && rangeHeader.contains("bytes=")) {
            String[] ranges = rangeHeader.substring("bytes=".length()).split("-");
            rangeStart = Long.parseLong(ranges[0]);
            rangeEnd = ranges.length > 1 ? Long.parseLong(ranges[1]) : Long.MAX_VALUE;
        }

        ResourceRegion resourceRegion = audioService.getAudioResourceRegion(fileName, rangeStart, rangeEnd, conversationId);

        return ResponseEntity
                .status(HttpStatus.PARTIAL_CONTENT)
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(resourceRegion);
    }
}
