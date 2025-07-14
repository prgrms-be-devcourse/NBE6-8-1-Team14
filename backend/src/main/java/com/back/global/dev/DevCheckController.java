package com.back.global.dev;

import io.swagger.v3.oas.annotations.Hidden;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@Hidden // swagger에 노출 안되도록
@RestController
public class DevCheckController {

    @GetMapping("/dev-check")
    public String healthCheck() {
        return "Success Dev Check";
    }
}