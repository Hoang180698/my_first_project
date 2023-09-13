package com.example.snwbackend.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@Controller
public class TestController {
    @GetMapping("/test")
    public @ResponseBody String test() {
        return "index";
    }
}
