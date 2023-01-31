import { prisma } from "@/config";
import { UpsertEnrollment } from "@/protocols";
import { Enrollment } from "@prisma/client";

export async function upsertEnrollment(newEnrollment: UpsertEnrollment, userId: number): Promise<Enrollment> {
  return prisma.enrollment.upsert({
    where: { userId },
    create: {
      enrollmentUrl: newEnrollment.enrollmentUrl,
      CPF: newEnrollment.CPF,
      name: newEnrollment.name,
      userId,
    },
    update: {
      enrollmentUrl: newEnrollment.enrollmentUrl,
      CPF: newEnrollment.CPF,
      name: newEnrollment.name,
      userId,
    },
  });
}

export function findEnrollmentByUserId(userId: number): Promise<Enrollment> {
  return prisma.enrollment.findFirst({
    where: { userId },
  });
}

export function findEnrollmentById(id: number): Promise<Enrollment> {
  return prisma.enrollment.findFirst({
    where: { id },
  });
}

export function updateEnrollmentBalance(balance:number, id:number):Promise<Enrollment>{
  return prisma.enrollment.update({
    where:{id},
    data:{balance}
  });
}

export function updateEnrollmentFreezedBalance(balance:number, id:number):Promise<Enrollment>{
  return prisma.enrollment.update({
    where:{id},
    data:{freezedBalance: balance}
  });
}

export function findEnrollmentByCPF(cpf: string) : Promise<Enrollment>{
  return prisma.enrollment.findFirst({
    where:{CPF:cpf}
  });
}

const enrollmentRepository = {
  upsertEnrollment,
  findEnrollmentByUserId,
  updateEnrollmentBalance,
  updateEnrollmentFreezedBalance,
  findEnrollmentById,
  findEnrollmentByCPF
};

export default enrollmentRepository;
