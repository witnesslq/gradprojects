package com.mafuzhi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.embedded.ConfigurableEmbeddedServletContainer;
import org.springframework.boot.context.embedded.EmbeddedServletContainerCustomizer;
import org.springframework.boot.web.servlet.ErrorPage;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
public class GradprojectApplication {

	public static void main(String[] args) {

//		BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder();
//		int password = 709722929;
//		System.out.println(bCryptPasswordEncoder.encode(password));

		SpringApplication.run(GradprojectApplication.class, args);

	}
	@Bean
	public EmbeddedServletContainerCustomizer containerCustomizer() {
		return container -> container.addErrorPages(new ErrorPage(HttpStatus.NOT_FOUND, "/404.html"));
	}
}