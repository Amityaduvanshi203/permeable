from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field


router = APIRouter(prefix="/samples", tags=["Samples"])
samples = []


class Sample(BaseModel):
	name: str = Field(min_length=1)
	material: str = Field(min_length=1)
	thickness: float = Field(gt=0)


@router.get("")
def get_samples():
	return {"status": "success", "data": samples}


@router.post("")
def create_sample(sample: Sample):
	next_id = max((item["id"] for item in samples), default=0) + 1
	saved_sample = {
		"id": next_id,
		**sample.model_dump(),
		"status": "Pending",
		"rate": None,
	}
	samples.append(saved_sample)
	return {"status": "success", "data": saved_sample}


@router.delete("/{sample_id}")
def delete_sample(sample_id: int):
	for index, sample in enumerate(samples):
		if sample["id"] == sample_id:
			return {"status": "success", "data": samples.pop(index)}
	raise HTTPException(status_code=404, detail="Sample not found")
