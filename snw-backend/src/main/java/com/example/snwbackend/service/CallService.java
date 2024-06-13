package com.example.snwbackend.service;

import com.example.snwbackend.entity.User;
import com.example.snwbackend.entity.UserConversation;
import com.example.snwbackend.exception.BadRequestException;
import com.example.snwbackend.exception.NotFoundException;
import com.example.snwbackend.repository.UserConversationRepository;
import com.example.snwbackend.repository.UserRepository;
import com.example.snwbackend.response.CallTokenResponse;
import com.example.snwbackend.utils.TokenServerAssistant;
import lombok.extern.slf4j.Slf4j;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.security.MessageDigest;
import java.security.SecureRandom;


@Service
@Slf4j
public class CallService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserConversationRepository userConversationRepository;

    @Value("${app.appId}")
    private long appId;

    @Value("${app.serverSecret}")
    private String severSecret;

    public CallTokenResponse getTokenForCall(Integer conversationId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> {
            throw new NotFoundException("Not found user with email = " + email);
        });

        UserConversation userConversation = userConversationRepository.findById_UserIdAndId_ConversationId(user.getId(), conversationId).orElseThrow(() -> {
            throw new BadRequestException("You aren't in conversation have id: " + conversationId);
        });
        String userId = user.getId().toString();
        String avatarUrl = user.getAvatar();
        if(avatarUrl != null) {
            userId = userId + avatarUrl.replaceAll("/","_");
        }
        // Create the payloadData object
        JSONObject payloadData = new JSONObject();
        payloadData.put("room_id", conversationId.toString()); // Room ID, restricts users to logging in to specific rooms, required.
        JSONObject privilege = new JSONObject();
        //Login room permission TokenServerAssistant.PrivilegeEnable means allowed, TokenServerAssistant.PrivilegeDisable means not allowed
        //This means that logging in to the room is allowed
        privilege.put(TokenServerAssistant.PrivilegeKeyLogin, TokenServerAssistant.PrivilegeEnable);

        //Whether to allow streaming TokenServerAssistant.PrivilegeEnable means allowed, TokenServerAssistant.PrivilegeDisable means not allowed
        //This means that streaming is not allowed
        privilege.put(TokenServerAssistant.PrivilegeKeyPublish, TokenServerAssistant.PrivilegeDisable);
        payloadData.put("privilege", privilege); // Required, one or both of the login room and streaming permissions must be assigned.
        payloadData.put("stream_id_list", null); // Stream list, optional
        String payload = payloadData.toJSONString();

        int effectiveTimeInSeconds = 300; // Valid time, in seconds

        TokenServerAssistant.VERBOSE = false;    // When debugging, set to true to output more information to the console; when running formally, it is best to set to false

        TokenServerAssistant.TokenInfo token = TokenServerAssistant.generateToken04(appId, userId, severSecret, effectiveTimeInSeconds, payload);

        byte[] bytes = new byte[8];
        SecureRandom sr = null;
        //Create a cryptographically strong random number generator using the SecureRandom class.
        try{
            sr = new SecureRandom();
        }catch(Exception e){
            e.printStackTrace();
        }
        sr.nextBytes(bytes);
        String signatureNonce = bytesToHex(bytes);
        long timestamp = System.currentTimeMillis() / 1000L;
        String signature = GenerateSignature(appId, signatureNonce, severSecret, timestamp);

        return new CallTokenResponse(token.data, signature, signatureNonce);
    }

    private String bytesToHex(byte[] bytes) {
        StringBuffer md5str = new StringBuffer();
        //Convert each byte of the array into a hex string and concatenate all the converted hex strings into an md5 string.
        int digital;
        for (int i = 0; i < bytes.length; i++) {
            digital = bytes[i];
            if (digital < 0) {
                digital += 256;
            }
            if (digital < 16) {
                md5str.append("0");
            }
            md5str.append(Integer.toHexString(digital));
        }
        return md5str.toString();
    }
    // Signature=md5(AppId + SignatureNonce + ServerSecret + Timestamp)
    private String GenerateSignature(long appId, String signatureNonce, String serverSecret, long timestamp){
        String str = String.valueOf(appId) + signatureNonce + serverSecret + String.valueOf(timestamp);
        String signature = "";
        try{
            //Create a MD5 message digest instance.
            MessageDigest md = MessageDigest.getInstance("MD5");
            //Generate a byte array.
            byte[] bytes = md.digest(str.getBytes("utf-8"));
            //Convert each byte of the array into a hex string and concatenate all the converted hex strings into an md5 string.
            signature = bytesToHex(bytes);
        }catch (Exception e) {
            e.printStackTrace();
        }
        return signature;
    }
}
