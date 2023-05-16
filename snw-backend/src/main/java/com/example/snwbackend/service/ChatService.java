package com.example.snwbackend.service;

import com.example.snwbackend.entity.Contact;
import com.example.snwbackend.entity.Message;
import com.example.snwbackend.entity.User;
import com.example.snwbackend.exception.BadRequestException;
import com.example.snwbackend.exception.NotFoundException;
import com.example.snwbackend.repository.ContactRepository;
import com.example.snwbackend.repository.MessageRepository;
import com.example.snwbackend.repository.UserRepository;
import com.example.snwbackend.request.ContactRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ChatService {

    @Autowired
    private ContactRepository contactRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MessageRepository messageRepository;

    public Contact createContact(ContactRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> {
            throw new NotFoundException("Not found user with email = " + email);
        });
        User user2 = userRepository.findById(request.getUserId()).orElseThrow(() -> {
            throw new NotFoundException("Not found user with id = " + request.getUserId());
        });

        Optional<Contact> contact = contactRepository.getContactBy2User(user.getId(), user2.getId());
        if(contact.isPresent()) {
            return contact.get();
        } else {
            Contact newContact = Contact.builder()
                    .user1(user)
                    .user2(user2)
                    .build();
            return contactRepository.save(newContact);
        }
    }

    public List<Contact> getAllContact() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> {
            throw new NotFoundException("Not found user with email = " + email);
        });

        return contactRepository.getAllContactByUserId(user.getId());
    }

    public List<Message> getAllMessageByContactId(Integer contactId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> {
            throw new NotFoundException("Not found user with email = " + email);
        });
        Contact contact = contactRepository.findById(contactId).orElseThrow(() -> {
            throw new NotFoundException("Not found contact with id = " + contactId);
        });

        if (user.getId() != contact.getUser1().getId() && user.getId() != contact.getUser2().getId()) {
            throw new BadRequestException("You do not have permission");
        }

        return messageRepository.findAllByContactOrderByCreatedAtDesc(contact);
    }

    public Contact getContactById(Integer id) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> {
            throw new NotFoundException("Not found user with email = " + email);
        });
        Contact contact = contactRepository.findById(id).orElseThrow(() -> {
            throw new NotFoundException("Not found contact with id = " + id);
        });
        if (user.getId() != contact.getUser1().getId() && user.getId() != contact.getUser2().getId()) {
            throw new BadRequestException("You do not have permission");
        }

        return contact;
    }
}
