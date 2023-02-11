import { EnrollmentWithNoId } from "@/protocols";
import { faker } from "@faker-js/faker";
import { prisma } from "@/config";
import { Enrollment } from "@prisma/client";
import { generateCPF } from "@brazilian-utils/brazilian-utils";

export async function createEnrollment(userId : number) : Promise<Enrollment>{
  const enrollment : EnrollmentWithNoId = {
    name : faker.name.firstName().toUpperCase(),
    CPF : generateCPF(),
    userId,
    balance: 0,
    enrollmentUrl : faker.image.imageUrl(undefined,undefined,undefined,true),
    freezedBalance: 0
  };


  return prisma.enrollment.create({
    data: enrollment
  });
}