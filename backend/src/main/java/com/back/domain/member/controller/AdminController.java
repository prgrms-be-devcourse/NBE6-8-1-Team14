package com.back.domain.member.controller;


import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "AdminController", description = "API 관리자 컨트롤러")
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

}
