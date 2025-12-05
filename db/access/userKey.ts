import prisma from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

/**
 * 创建用户密钥
 * @param userId 用户ID
 * @param publicKey 公钥
 * @param privateKey 私钥
 * @returns 创建的用户密钥
 */
export const createUserKey = async (userId: string, publicKey: string, privateKey: string) => {
  return await prisma.user_key.create({
    data: {
      id: uuidv4(),
      userId,
      publicKey,
      privateKey,
      status: 1, // 1表示激活状态
      updatedAt: new Date()
    }
  });
};

/**
 * 删除用户密钥
 * @param id 密钥ID
 * @returns 删除操作的结果
 */
export const deleteUserKey = async (id: string) => {
  return await prisma.user_key.delete({
    where: { id }
  });
};

/**
 * 根据用户ID获取所有密钥
 * @param userId 用户ID
 * @returns 用户的所有密钥
 */
export const getUserKeysByUserId = async (userId: string) => {
  return await prisma.user_key.findMany({
    where: { userId }
  });
};

/**
 * 根据密钥ID获取密钥
 * @param id 密钥ID
 * @returns 密钥信息
 */
export const getUserKeyById = async (id: string) => {
  return await prisma.user_key.findUnique({
    where: { id }
  });
};

/**
 * 更新密钥状态
 * @param id 密钥ID
 * @param status 状态 (1: 激活, 0: 禁用)
 * @returns 更新后的密钥
 */
export const updateUserKeyStatus = async (id: string, status: number) => {
  return await prisma.user_key.update({
    where: { id },
    data: {
      status,
      updatedAt: new Date()
    }
  });
};