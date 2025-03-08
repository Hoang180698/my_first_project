package com.example.snwbackend;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.snwbackend.service.CloudinaryService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Bean;
import org.springframework.test.context.ContextConfiguration;

import java.util.Map;

@ContextConfiguration
public class CloudinaryTest {

    private final String cloudName = "dwz1g45qp";
    private final String apiKey = "292168451399751";
    private final String apiSecret = "w5ENN08sUe_MkVRkYPIo1bqZ4Dk";

    @Test
    public void deleteVideo() {
        Cloudinary cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret
        ));
        try {
//            cloudinary.api().deleteFolder("3252", ObjectUtils.emptyMap());
//            cloudinary.api().deleteResourcesByPrefix("3252", ObjectUtils.emptyMap());
          cloudinary.api().deleteResourcesByTag("3502",ObjectUtils.asMap("resource_type", "video"));
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }

    }
}
